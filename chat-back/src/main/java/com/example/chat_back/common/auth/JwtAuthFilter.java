package com.example.chat_back.common.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// 토큰이 우리 서버에서 만들어준 토큰인지 아닌지를 검증
@Component
public class JwtAuthFilter extends GenericFilter {

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        String token = httpServletRequest.getHeader("Authorization"); // HTTP 요청헤더에서 "Authorization" 헤더 값 추출

        try {
            if (token != null) {
                // Bearer 형식 검증
                if (!token.substring(0,7).equals("Bearer ")){
                    throw new AuthenticationServiceException("Bearer 형식이 아닙니다.");
                }

                String jwtToken = token.substring(7);

                // Jwts.parserBuilder: 파싱면서 다시 암호화 하는 메서드 사용해서 토큰 검증
                Claims claims = Jwts.parserBuilder()    // authentication 객체 만들기 위해
                        .setSigningKey(secretKey)   // header + payload + signature(header + payload + secretKey)
                        .build()
                        .parseClaimsJws(jwtToken)
                        .getBody(); // claims 추출: payload에 접근할 수 있음 (email, role 접근 가능)

                // 인증(Authentication) 객체 생성
                List<GrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_"+claims.get("role")));
                UserDetails userDetails = new User(claims.getSubject(), "", authorities); // 이메일, 비밀번호, 권한
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,    // 인증된 사용자 정보
                        "",             // 자격증명
                        userDetails.getAuthorities()    // 사용자 권한 정보
                );

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            // JWT token 검증 완료 후 또는 token 없는 경우, 다시 원래 chain으로 돌아가기 위함
            chain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpServletResponse.setContentType("application/json");
            httpServletResponse.getWriter().write("invalid token");
        }
    }
}
