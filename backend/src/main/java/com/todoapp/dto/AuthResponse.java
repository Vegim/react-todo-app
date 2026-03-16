package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "JWT auth response returned after successful login or registration")
public record AuthResponse(

        @Schema(description = "Bearer JWT token")
        String token,

        @Schema(description = "Authenticated username")
        String username
) {}
