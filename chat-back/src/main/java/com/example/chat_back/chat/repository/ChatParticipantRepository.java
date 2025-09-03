package com.example.chat_back.chat.repository;

import com.example.chat_back.chat.domain.ChatParticipant;
import com.example.chat_back.chat.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant,Long> {
    List<ChatParticipant> findByChatRoom(ChatRoom chatRoom);
}
