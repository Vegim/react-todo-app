package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload to update an existing todo – all fields are optional")
public record UpdateTodoRequest(

        @Schema(description = "Updated todo text", nullable = true)
        @Size(max = 1000, message = "Text must not exceed 1000 characters")
        String text,

        @Schema(description = "Whether the todo is pinned", nullable = true)
        Boolean pinned,

        @Schema(description = "Whether the todo is completed", nullable = true)
        Boolean completed,

        @Schema(description = "Category name", example = "Work", nullable = true)
        @Size(max = 50, message = "Category must not exceed 50 characters")
        String category,

        @Schema(description = "Reminder timestamp as epoch milliseconds; null means no change, 0 or negative clears the reminder", nullable = true)
        Long reminderAt
) {}
