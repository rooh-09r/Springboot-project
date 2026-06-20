package com.quizplatform.service.interfaces;

import com.quizplatform.dto.request.LoginRequest;
import com.quizplatform.dto.request.RegisterRequest;
import com.quizplatform.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
