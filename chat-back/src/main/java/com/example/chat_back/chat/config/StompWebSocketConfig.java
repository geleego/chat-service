package com.example.chat_back.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class StompWebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // 아래는 WebSocketMessageBrokerConfigurer의 메서드 오버라이딩

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/connect")
                .setAllowedOrigins("http://localhost:3000") // Securityconfigs와는 별개로 ws CORS 설정 별도 설정
                .withSockJS(); // 'ws://'가 아닌 'http://' 엔드포인트를 사용할 수 있게 해주는 'sockJs' 라이브러리를 통해 요청을 허용
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // '/publish'로 시작하는 url 형태로 메시지 발행(publish)해야 함을 설정
        // 메시지가 발행되면, @Controller 객체의 @MessaMapping 메서드로 라우팅
        registry.setApplicationDestinationPrefixes("/publish");

        // '/topic'으로 시작하는 url 형태로 메시지 수신(subscribe)해야 함을 설정
        registry.enableSimpleBroker("/topic");
    }
}
