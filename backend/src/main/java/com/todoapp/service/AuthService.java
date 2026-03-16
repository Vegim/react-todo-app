package com.todoapp.service;

import com.todoapp.dto.*;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import com.todoapp.security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken");
        }

        User user = User.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username().trim(),
                        request.password()
                )
        );

        String username = auth.getName();
        String token = jwtUtil.generateToken(username);
        return new AuthResponse(token, username);
    }
}
