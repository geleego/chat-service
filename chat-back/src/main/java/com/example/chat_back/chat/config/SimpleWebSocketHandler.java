//package com.example.chat_back.chat.config;
//
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.*;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.util.HashSet;
//import java.util.Set;
//import java.util.concurrent.ConcurrentHashMap;
//
//// '/connect'로 웹소켓 연결 요청이 들어왔을 때, 이를 처리하는 class
//@Component
//public class SimpleWebSocketHandler extends TextWebSocketHandler {
//    // 아래는 웹소켓 라이프사이클 메서드(TextWebSocketHandler > AbstractWebSocketHandler)들을 오버라이드하여 재정의
//
//    // Set 자료구조 정의: 연결된 세션 관리
//    // ConcurrentHashMap: thread-safe(연결이 동시에 여러개 들어오는 경우, 안정적으로 세션 저장)한 set 사용
//    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
//
//    // 연결이 되면 어떻게 처리할 것인지: set에 사용자 연결정보 등록
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        sessions.add(session);
//        System.out.println("Connected: " + session.getId());
//    }
//
//    // 사용자에게 메시지를 보내주는 메서드
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//        System.out.println("Received: " + payload);
//        for(WebSocketSession s : sessions){
//            if(s.isOpen()){
//                s.sendMessage(new TextMessage(payload));
//            }
//        }
//    }
//
//    // 연결이 해제되면 어떻게 처리할 것인지: session을 메모리에서 삭제
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        sessions.remove(session);
//        System.out.println("Disconnected");
//    }
//}
