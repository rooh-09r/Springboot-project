package com.quizplatform;

import com.quizplatform.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class JwtServiceTest {

    @Test
    void testGenerateToken() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "404e635266556a586e3272357538782f413f442a472d4b6150645367566b5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);

        String token = jwtService.generateToken(User.withUsername("test@test.com").password("pass").roles("USER").build());
        assertNotNull(token);
    }
}
