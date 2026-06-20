package com.quizplatform;

import com.quizplatform.dto.request.RegisterRequest;
import com.quizplatform.dto.response.AuthResponse;
import com.quizplatform.entity.Role;
import com.quizplatform.entity.User;
import com.quizplatform.repository.UserRepository;
import com.quizplatform.security.JwtService;
import com.quizplatform.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void testRegister() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");
        request.setFullName("Test User");

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        
        User savedUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .fullName("Test User")
                .role(Role.USER)
                .build();
        
        when(userRepository.save(any())).thenReturn(savedUser);
        
        when(userDetailsService.loadUserByUsername(any())).thenReturn(
            org.springframework.security.core.userdetails.User.withUsername("test@test.com").password("encoded").roles("USER").build()
        );
        when(jwtService.generateToken(any())).thenReturn("token");

        AuthResponse response = authService.register(request);
        assertNotNull(response.getAccessToken());
    }
}
