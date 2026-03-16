package com.todoapp.controller;

import com.todoapp.dto.*;
import com.todoapp.service.TodoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/todos")
@Tag(name = "Todos", description = "CRUD operations for todos, scoped to the authenticated user")
@SecurityRequirement(name = "bearerAuth")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    @Operation(summary = "List all todos for the current user")
    public List<TodoResponse> getTodos(@AuthenticationPrincipal UserDetails principal) {
        return todoService.getTodos(principal.getUsername());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Create a new todo",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Todo created",
                            content = @Content(schema = @Schema(implementation = TodoResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Validation error",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public TodoResponse createTodo(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody TodoRequest request
    ) {
        return todoService.createTodo(principal.getUsername(), request);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update a todo",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Todo updated",
                            content = @Content(schema = @Schema(implementation = TodoResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Todo not found",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    public TodoResponse updateTodo(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTodoRequest request
    ) {
        return todoService.updateTodo(principal.getUsername(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a todo by ID")
    public void deleteTodo(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id
    ) {
        todoService.deleteTodo(principal.getUsername(), id);
    }

    @PatchMapping("/{id}/pin")
    @Operation(summary = "Toggle the pinned state of a todo")
    public TodoResponse togglePin(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id
    ) {
        return todoService.togglePin(principal.getUsername(), id);
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Toggle the completed state of a todo")
    public TodoResponse toggleComplete(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable UUID id
    ) {
        return todoService.toggleComplete(principal.getUsername(), id);
    }

    @DeleteMapping("/completed")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete all completed todos for the current user")
    public void clearCompleted(@AuthenticationPrincipal UserDetails principal) {
        todoService.clearCompleted(principal.getUsername());
    }

    @PostMapping("/import")
    @Operation(
            summary = "Bulk-import todos",
            description = "Creates new todos from the provided list. Each item is inserted as a new todo."
    )
    public List<TodoResponse> importTodos(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody List<@Valid TodoRequest> requests
    ) {
        return todoService.importTodos(principal.getUsername(), requests);
    }

    @GetMapping("/export")
    @Operation(summary = "Export all todos for the current user (same as GET /api/todos)")
    public List<TodoResponse> exportTodos(@AuthenticationPrincipal UserDetails principal) {
        return todoService.exportTodos(principal.getUsername());
    }
}
