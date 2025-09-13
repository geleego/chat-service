package com.example.chat_back.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class StompWebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final StompHandler stompHandler;

    public StompWebSocketConfig(StompHandler stompHandler) {
        this.stompHandler = stompHandler;
    }

    // 아래는 WebSocketMessageBrokerConfigurer의 메서드 오버라이딩

    @Override
    // stomp endpoint url 매핑 및 socket 옵션 활성화
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/connect")
                .setAllowedOrigins("http://localhost:3000") // Securityconfigs와는 별개로 ws CORS 설정 별도 설정
                .withSockJS()
                .setStreamBytesLimit(4 * 1024 * 1024) // 4MB 스트림 바이트 제한
                .setHttpMessageCacheSize(2000) // HTTP 메시지 캐시 크기 증가
                .setSessionCookieNeeded(false) // 세션 쿠키 비활성화
                .setHeartbeatTime(25000) // 25초 heartbeat 간격
                .setDisconnectDelay(30000); // 30초 연결 해제 지연
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // '/publish'로 시작하는 url 형태로 메시지 발행(publish)해야 함을 설정
        // 메시지가 발행되면, @Controller 객체의 @MessaMapping 메서드로 라우팅
        registry.setApplicationDestinationPrefixes("/publish");

        // '/topic'으로 시작하는 url 형태로 메시지 수신(subscribe)해야 함을 설정
        registry.enableSimpleBroker("/topic")
                .setHeartbeatValue(new long[]{10000, 10000}); // 브로커 heartbeat 설정
    }

    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        // 아웃바운드 채널 설정 - 서버에서 클라이언트로 메시지 전송 시 사용
        registration.taskExecutor()
                .corePoolSize(8)    // 기본 스레드 풀 크기 증가
                .maxPoolSize(16)    // 최대 스레드 풀 크기 증가
                .queueCapacity(1000) // 큐 용량 설정으로 버퍼링 개선
                .keepAliveSeconds(60); // 유휴 스레드 유지 시간
    }

    @Override
    // 웹소켓의 connect, subscribe, disconnect 등의 요청시에는 http 메시지(http header 등)를 넣을 수 있고,
    // 이를 interceptor가 통해 가로채서 토큰을 검증
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler)
                .taskExecutor()
                .corePoolSize(8)    // 인바운드 채널 스레드 풀 크기
                .maxPoolSize(16)    // 최대 스레드 풀 크기
                .queueCapacity(500) // 인바운드 큐 용량
                .keepAliveSeconds(60);
    }
}
