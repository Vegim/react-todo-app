import { useState, useEffect, useCallback } from "react";
import * as profileApi from "~/api/profileApi";

export interface Profile {
  displayName: string;
  birthday: string;
  bio: string;
  avatarDataUrl: string | null;
}

const DEFAULT_PROFILE: Profile = {
  displayName: "",
  birthday: "",
  bio: "",
  avatarDataUrl: null,
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    profileApi.getProfile()
      .then((data) => setProfile({ ...DEFAULT_PROFILE, ...data }))
      .catch(() => {}); // keep defaults if profile not found
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    const updated = await profileApi.updateProfile(updates);
    setProfile({ ...DEFAULT_PROFILE, ...updated });
  }, []);

  return { profile, updateProfile };
}
