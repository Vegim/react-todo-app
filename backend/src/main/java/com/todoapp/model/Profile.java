package com.todoapp.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "display_name", length = 100)
    private String displayName = "";

    @Column
    private LocalDate birthday;

    @Column(columnDefinition = "TEXT")
    private String bio = "";

    /** Base64-encoded JPEG data URL – can be very large, stored as TEXT. */
    @Column(name = "avatar_data_url", columnDefinition = "TEXT")
    private String avatarDataUrl;

    public Profile() {}

    private Profile(Builder builder) {
        this.user = builder.user;
        this.displayName = builder.displayName;
        this.birthday = builder.birthday;
        this.bio = builder.bio;
        this.avatarDataUrl = builder.avatarDataUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private User user;
        private String displayName = "";
        private LocalDate birthday;
        private String bio = "";
        private String avatarDataUrl;

        public Builder user(User user) { this.user = user; return this; }
        public Builder displayName(String displayName) { this.displayName = displayName; return this; }
        public Builder birthday(LocalDate birthday) { this.birthday = birthday; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder avatarDataUrl(String avatarDataUrl) { this.avatarDataUrl = avatarDataUrl; return this; }
        public Profile build() { return new Profile(this); }
    }

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public String getDisplayName() { return displayName; }
    public LocalDate getBirthday() { return birthday; }
    public String getBio() { return bio; }
    public String getAvatarDataUrl() { return avatarDataUrl; }

    public void setUser(User user) { this.user = user; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }
    public void setBio(String bio) { this.bio = bio; }
    public void setAvatarDataUrl(String avatarDataUrl) { this.avatarDataUrl = avatarDataUrl; }
}
