package com.todoapp.service;

import com.todoapp.dto.*;
import com.todoapp.model.Profile;
import com.todoapp.model.User;
import com.todoapp.repository.ProfileRepository;
import com.todoapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile(String username) {
        User user = resolveUser(username);
        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> buildDefaultProfile(user));
        return ProfileDto.from(profile);
    }

    @Transactional
    public ProfileDto updateProfile(String username, UpdateProfileRequest request) {
        User user = resolveUser(username);

        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> profileRepository.save(buildDefaultProfile(user)));

        if (request.displayName() != null) {
            profile.setDisplayName(request.displayName().trim());
        }
        if (request.bio() != null) {
            profile.setBio(request.bio());
        }
        if (request.birthday() != null) {
            if (StringUtils.hasText(request.birthday())) {
                try {
                    profile.setBirthday(LocalDate.parse(request.birthday()));
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("birthday must be in ISO format YYYY-MM-DD");
                }
            } else {
                profile.setBirthday(null);
            }
        }
        if (request.avatarDataUrl() != null) {
            profile.setAvatarDataUrl(request.avatarDataUrl());
        }

        return ProfileDto.from(profileRepository.save(profile));
    }

    private Profile buildDefaultProfile(User user) {
        return Profile.builder()
                .user(user)
                .displayName("")
                .bio("")
                .build();
    }
}
