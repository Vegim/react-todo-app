package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload to create a new todo")
public record TodoRequest(

        @Schema(description = "Todo text", example = "Buy groceries")
        @NotBlank(message = "Text must not be blank")
        @Size(max = 1000, message = "Text must not exceed 1000 characters")
        String text,

        @Schema(description = "Category name", example = "Shopping", nullable = true)
        @Size(max = 50, message = "Category must not exceed 50 characters")
        String category,

        @Schema(description = "Reminder timestamp as epoch milliseconds; null means no reminder", nullable = true)
        Long reminderAt
) {}
