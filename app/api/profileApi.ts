import { apiClient } from "./client";
import type { ProfileDto, UpdateProfileRequest } from "./types";

const BASE = "/api/profile";

/** Fetch the current user's profile. */
export function getProfile(): Promise<ProfileDto> {
  return apiClient.get<ProfileDto>(BASE);
}

/**
 * Update the current user's profile.
 * All fields are optional – only provided fields are updated.
 * Pass `avatarDataUrl: null` to clear the avatar.
 */
export function updateProfile(payload: UpdateProfileRequest): Promise<ProfileDto> {
  return apiClient.put<ProfileDto>(BASE, payload);
}
