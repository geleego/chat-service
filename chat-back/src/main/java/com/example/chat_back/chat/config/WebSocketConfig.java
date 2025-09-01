//package com.example.chat_back.chat.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//
//// 웹 소켓 관련한 설정 정보들 관리
//@Configuration
//@EnableWebSocket
//public class WebSoketConfig implements WebSocketConfigurer {
//    private final WebSocketHandler webSocketHandler;
//
//    public WebSoketConfig(WebSocketHandler webSocketHandler) {
//        this.webSocketHandler = webSocketHandler;
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        // '/connect' url로 websocket 연결 요청이 들어오면, handler class가 처리
//        registry.addHandler(webSocketHandler, "/connect")
//                .setAllowedOrigins("http://localhost:3000"); // 웹소켓 프로토콜 요청은 별도의 프론트 port CORS 예외 처리 필요
//    }
//}
