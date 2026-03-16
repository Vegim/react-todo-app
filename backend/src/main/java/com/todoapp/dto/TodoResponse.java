package com.todoapp.dto;

import com.todoapp.model.Todo;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Todo item returned by the API")
public record TodoResponse(

        @Schema(description = "UUID of the todo")
        UUID id,

        @Schema(description = "Todo text")
        String text,

        @Schema(description = "Whether the todo is pinned")
        boolean pinned,

        @Schema(description = "Whether the todo is completed")
        boolean completed,

        @Schema(description = "Creation timestamp as epoch milliseconds")
        long createdAt,

        @Schema(description = "Category name", nullable = true)
        String category
) {
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getText(),
                todo.isPinned(),
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getCategory()
        );
    }
}
