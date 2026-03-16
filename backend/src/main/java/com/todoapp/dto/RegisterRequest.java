package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload to register a new user")
public record RegisterRequest(

        @Schema(description = "Desired username (letters, digits, underscores)", example = "alice")
        @NotBlank(message = "Username must not be blank")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username may only contain letters, digits and underscores")
        String username,

        @Schema(description = "Password (min 4 characters)", example = "s3cr3t!")
        @NotBlank(message = "Password must not be blank")
        @Size(min = 4, max = 100, message = "Password must be between 4 and 100 characters")
        String password
) {}
