package com.example.chat_back.chat.repository;

import com.example.chat_back.chat.domain.ChatParticipant;
import com.example.chat_back.chat.domain.ChatRoom;
import com.example.chat_back.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant,Long> {
    List<ChatParticipant> findByChatRoom(ChatRoom chatRoom);

    Optional<ChatParticipant> findByChatRoomAndMember(ChatRoom chatRoom, Member member);
}
