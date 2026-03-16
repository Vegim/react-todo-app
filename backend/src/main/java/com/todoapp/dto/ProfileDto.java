package com.todoapp.dto;

import com.todoapp.model.Profile;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.format.DateTimeFormatter;

@Schema(description = "User profile data")
public record ProfileDto(

        @Schema(description = "Display name of the user")
        String displayName,

        @Schema(description = "Birthday in ISO format YYYY-MM-DD", nullable = true, example = "1990-06-15")
        String birthday,

        @Schema(description = "Short bio text")
        String bio,

        @Schema(description = "Base64 JPEG data URL for avatar", nullable = true)
        String avatarDataUrl
) {
    public static ProfileDto from(Profile profile) {
        String birthday = profile.getBirthday() != null
                ? profile.getBirthday().format(DateTimeFormatter.ISO_LOCAL_DATE)
                : "";
        return new ProfileDto(
                profile.getDisplayName() != null ? profile.getDisplayName() : "",
                birthday,
                profile.getBio() != null ? profile.getBio() : "",
                profile.getAvatarDataUrl()
        );
    }
}
