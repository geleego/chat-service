package com.example.chat_back.member.service;

import com.example.chat_back.member.domain.Member;
import com.example.chat_back.member.dto.MemberSaveReqDto;
import com.example.chat_back.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member create(MemberSaveReqDto memberSaveReqDto) {
        // 이미 가입되어 있는 이메일 검증
        if (memberRepository.findByEmail(memberSaveReqDto.getEmail()).isPresent()){
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        Member newMember = Member.builder()
                .name(memberSaveReqDto.getName())
                .email(memberSaveReqDto.getEmail())
                .password(memberSaveReqDto.getPassword())
                .build();
        Member member = memberRepository.save(newMember);

        // + 추 후, 비밀번호 길이와 같은 검증 로직 추가하면 좋을 듯

        return member;
    }
}
