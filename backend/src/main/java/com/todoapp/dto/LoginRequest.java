package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Credentials for login")
public record LoginRequest(

        @Schema(description = "Username", example = "john")
        @NotBlank(message = "Username must not be blank")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        String username,

        @Schema(description = "Password", example = "secret")
        @NotBlank(message = "Password must not be blank")
        @Size(min = 4, max = 100, message = "Password must be between 4 and 100 characters")
        String password
) {}
