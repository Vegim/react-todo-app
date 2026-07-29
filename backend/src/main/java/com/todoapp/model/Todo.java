package com.todoapp.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(nullable = false)
    private boolean pinned = false;

    @Column(nullable = false)
    private boolean completed = false;

    /** Epoch milliseconds – matches React's Date.now() contract. */
    @Column(name = "created_at", nullable = false)
    private Long createdAt;

    /** Plain string so new categories can be added without a migration. */
    @Column(length = 50)
    private String category;

    /** Epoch milliseconds for the reminder; null means no reminder. */
    @Column(name = "reminder_at")
    private Long reminderAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Todo() {}

    private Todo(Builder builder) {
        this.text = builder.text;
        this.pinned = builder.pinned;
        this.completed = builder.completed;
        this.createdAt = builder.createdAt;
        this.category = builder.category;
        this.reminderAt = builder.reminderAt;
        this.user = builder.user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String text;
        private boolean pinned = false;
        private boolean completed = false;
        private Long createdAt;
        private String category;
        private Long reminderAt;
        private User user;

        public Builder text(String text) { this.text = text; return this; }
        public Builder pinned(boolean pinned) { this.pinned = pinned; return this; }
        public Builder completed(boolean completed) { this.completed = completed; return this; }
        public Builder createdAt(Long createdAt) { this.createdAt = createdAt; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder reminderAt(Long reminderAt) { this.reminderAt = reminderAt; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Todo build() { return new Todo(this); }
    }

    public UUID getId() { return id; }
    public String getText() { return text; }
    public boolean isPinned() { return pinned; }
    public boolean isCompleted() { return completed; }
    public Long getCreatedAt() { return createdAt; }
    public String getCategory() { return category; }
    public Long getReminderAt() { return reminderAt; }
    public User getUser() { return user; }

    public void setText(String text) { this.text = text; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }
    public void setCategory(String category) { this.category = category; }
    public void setReminderAt(Long reminderAt) { this.reminderAt = reminderAt; }
    public void setUser(User user) { this.user = user; }
}
