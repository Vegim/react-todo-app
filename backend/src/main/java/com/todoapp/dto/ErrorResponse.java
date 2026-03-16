package com.todoapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Error response body")
public record ErrorResponse(

        @Schema(description = "Human-readable error message")
        String error
) {}
