package com.example.chat_back.chat.service;

import com.example.chat_back.chat.domain.ChatMessage;
import com.example.chat_back.chat.domain.ChatParticipant;
import com.example.chat_back.chat.domain.ChatRoom;
import com.example.chat_back.chat.domain.ReadStatus;
import com.example.chat_back.chat.dto.ChatMessageReqDto;
import com.example.chat_back.chat.dto.ChatRoomListResDto;
import com.example.chat_back.chat.repository.ChatMessageRepository;
import com.example.chat_back.chat.repository.ChatParticipantRepository;
import com.example.chat_back.chat.repository.ChatRoomRepository;
import com.example.chat_back.chat.repository.ReadStatusRepository;
import com.example.chat_back.member.domain.Member;
import com.example.chat_back.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ReadStatusRepository readStatusRepository;
    private final MemberRepository memberRepository;

    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository, ChatParticipantRepository chatParticipantRepository, ReadStatusRepository readStatusRepository, MemberRepository memberRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.chatParticipantRepository = chatParticipantRepository;
        this.readStatusRepository = readStatusRepository;
        this.memberRepository = memberRepository;
    }

    public void saveMessage(Long roomId, ChatMessageReqDto chatMessageReqDto) {
        // 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository
                .findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("room cannot be found"));

        // 보낸사람 조회
        Member sender = memberRepository
                .findByEmail(chatMessageReqDto.getSenderEmail())
                .orElseThrow(() -> new EntityNotFoundException("member cannot be found"));

        // 메시지 저장
        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .member(sender)
                .content(chatMessageReqDto.getMessage())
                .build();
        chatMessageRepository.save(chatMessage);

        // 사용자별 읽음 여부 저장
        List<ChatParticipant> chatParticipants = chatParticipantRepository.findByChatRoom(chatRoom);
        for(ChatParticipant c : chatParticipants){
            ReadStatus readStatus = ReadStatus.builder()
                    .chatRoom(chatRoom)
                    .member(c.getMember())  // 보낸사람(sender)이 아니라, 참여자들(c.getMember())을 조회하여 세팅
                    .chatMessage(chatMessage)
                    .isRead(c.getMember().equals(sender))   // 내가 보내는 사람이면, 읽음 여부는 true. 그 외 사람들은 false.
                    .build();
            readStatusRepository.save(readStatus);
        }
    }

    public void createGroupRoom(String roomName) {
        // 채팅방을 만드는 사람은 채팅방의 참여자로 자동 추가되어야 함
        Member member = memberRepository.findByEmail(
                SecurityContextHolder.getContext().getAuthentication().getName()
        ).orElseThrow(() -> new EntityNotFoundException("member cannot be found"));

        // 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .name(roomName)
                .isGroupChat("Y")
                .build();
        chatRoomRepository.save(chatRoom);

        // 채팅 참여자로 개설자를 추가
        ChatParticipant chatParticipant = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .member(member)
                .build();
        chatParticipantRepository.save(chatParticipant);
    }

    public List<ChatRoomListResDto> getGroupChatRooms() {
        // 단체 채팅방 조 (is_group_chat이 "Y"인 것만)
        List<ChatRoom> chatRooms = chatRoomRepository.findByIsGroupChat("Y");

        // chatRooms의 데이터들을 ChatRoomListResDto로 변환
        List<ChatRoomListResDto> dtos = new ArrayList<>();

        for (ChatRoom c : chatRooms) {
            ChatRoomListResDto dto = ChatRoomListResDto.builder()
                    .roomId(c.getId())
                    .roomName(c.getName())
                    .build();
            dtos.add(dto);
        }
        return dtos;
    }

    public void addParticipantToGroupChat(Long roomId) {
        // 채팅방 조회
        ChatRoom chatRoom = chatRoomRepository
                .findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("room cannot be found"));

        // member 조회
        Member member = memberRepository
                .findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new EntityNotFoundException("member cannot be found"));

        // 이미 참여자인지 검증
        Optional<ChatParticipant> participant = chatParticipantRepository.findByChatRoomAndMember(chatRoom, member);
        if(!participant.isPresent()){
            addParticipantToRoom(chatRoom, member);
        }
    }

    // ChatParticipant 객체 생성 후 저장
    public void addParticipantToRoom(ChatRoom chatRoom, Member member) {
        ChatParticipant chatParticipant = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .member(member)
                .build();
        chatParticipantRepository.save(chatParticipant);
    }
}
