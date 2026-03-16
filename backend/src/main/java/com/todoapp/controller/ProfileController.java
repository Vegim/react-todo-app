package com.todoapp.controller;

import com.todoapp.dto.*;
import com.todoapp.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile", description = "Read and update the authenticated user's profile")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(
            summary = "Get the current user's profile",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Profile returned",
                            content = @Content(schema = @Schema(implementation = ProfileDto.class)))
            }
    )
    public ProfileDto getProfile(@AuthenticationPrincipal UserDetails principal) {
        return profileService.getProfile(principal.getUsername());
    }

    @PutMapping
    @Operation(
            summary = "Update the current user's profile",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Profile updated",
                            content = @Content(schema = @Schema(implementation = ProfileDto.class))),
                    @ApiResponse(responseCode = "400", description = "Validation error",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public ProfileDto updateProfile(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return profileService.updateProfile(principal.getUsername(), request);
    }
}
