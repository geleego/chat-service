package com.example.chat_back.common.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final String secretKey;
    private final int expiration;
    private Key SECRET_KEY;

    // secretKey와 expiration 값을 application.yml에서 가져옴
    public JwtTokenProvider(@Value("${jwt.secretKey}") String secretKey, @Value("${jwt.expiration}") int expiration) {
        this.secretKey = secretKey;
        this.expiration = expiration;

        // secretKey를 decode 시킴 -> 동시에 HS512 알고리즘으로 암호화 시킴
        this.SECRET_KEY = new SecretKeySpec(
                java.util.Base64.getDecoder().decode(secretKey),
                SignatureAlgorithm.HS512.getJcaName()
        );
    }

    public String createToken(String email, String role){
        Claims claims = Jwts.claims().setSubject(email);    // claim의 key 역할: email
        claims.put("role", role);   // role은 커스텀 클레임이라서 Map 구조 put으로 넣음
        Date now = new Date();
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)   // 현재 시간으로 발행 시간 설정
                .setExpiration(new Date(now.getTime()+expiration*60*1000L)) // 현재 시간에 밀리초 단위로 만료 일자 설정
                .signWith(SECRET_KEY)   // 암호화된 시크릿 키로 서명
                .compact();
        return token;
    }
}
