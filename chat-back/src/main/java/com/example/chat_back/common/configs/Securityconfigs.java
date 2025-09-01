package com.example.chat_back.common.configs;

import com.example.chat_back.common.auth.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class Securityconfigs {
    private final JwtAuthFilter jwtAuthFilter;

    public Securityconfigs(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain myFilter(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) // csrf 비활성화
                .httpBasic(AbstractHttpConfigurer::disable) // HTTP Basic 비활성화

                // 어떤 URL 패턴을 허용할건지 filter 처리 필요
                // 인증 처리하지 않을 특정 URL 작성하여 Authentication 객체를 요구하지 않음 (인증 처리에서 제외). 그 외 나머지는 인증 처리.
                .authorizeHttpRequests(a ->
                        a.requestMatchers("/member/create","member/doLogin", "/connect/**")
                                .permitAll()    // 회원가입, 로그인은 누구나 인증 없이 접근 가능
                                .anyRequest().authenticated()   // 위에서 지정하지 않은 나머지 모든 요청들은 인증 필요
                )

                // 토큰 방식을 사용할 것이기 때문에, 세션 방식을 사용하지 않음
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 요청 들어오면 JWT token 검증 후 인증 처리
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // front-end 주소 허용
        corsConfiguration.setAllowedMethods(Arrays.asList("*")); // 모든 HTTP 메서드 허용
        corsConfiguration.setAllowedHeaders(Arrays.asList("*")); // 모든 Header 값 허용
        corsConfiguration.setAllowCredentials(true);    // 자격 증명 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // **은 모든 url 패턴에 대해 CORS 허용

        return source;
    }

    @Bean
    // PasswordEncoder 암호화 라이브러리를 싱글톤 객체로 등록하고 사용
    public PasswordEncoder makePassword() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
