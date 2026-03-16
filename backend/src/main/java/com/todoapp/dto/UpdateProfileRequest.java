package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload to update the user profile – all fields are optional")
public record UpdateProfileRequest(

        @Schema(description = "Display name", nullable = true)
        @Size(max = 100, message = "Display name must not exceed 100 characters")
        String displayName,

        @Schema(description = "Birthday in ISO format YYYY-MM-DD", nullable = true, example = "1990-06-15")
        String birthday,

        @Schema(description = "Short bio text", nullable = true)
        @Size(max = 500, message = "Bio must not exceed 500 characters")
        String bio,

        @Schema(description = "Base64 JPEG data URL for avatar (can be null to clear)", nullable = true)
        String avatarDataUrl
) {}
