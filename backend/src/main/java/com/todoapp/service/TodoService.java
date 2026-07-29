package com.todoapp.service;

import com.todoapp.dto.*;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Todo;
import com.todoapp.model.User;
import com.todoapp.repository.TodoRepository;
import com.todoapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final ClassifierService classifierService;

    public TodoService(TodoRepository todoRepository, UserRepository userRepository,
                       ClassifierService classifierService) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
        this.classifierService = classifierService;
    }

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private Todo resolveOwnedTodo(UUID todoId, User user) {
        return todoRepository.findByIdAndUser(todoId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found: " + todoId));
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getTodos(String username) {
        User user = resolveUser(username);
        return todoRepository.findByUserOrderByPinnedDescCreatedAtDesc(user)
                .stream()
                .map(TodoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> exportTodos(String username) {
        return getTodos(username);
    }

    @Transactional
    public TodoResponse createTodo(String username, TodoRequest request) {
        User user = resolveUser(username);
        String text = request.text().trim();
        String category = StringUtils.hasText(request.category())
                ? request.category().trim()
                : classifierService.classify(text);

        Todo todo = Todo.builder()
                .text(text)
                .category(category)
                .pinned(false)
                .completed(false)
                .createdAt(System.currentTimeMillis())
                .reminderAt(request.reminderAt())
                .user(user)
                .build();

        return TodoResponse.from(todoRepository.save(todo));
    }

    @Transactional
    public TodoResponse updateTodo(String username, UUID todoId, UpdateTodoRequest request) {
        User user = resolveUser(username);
        Todo todo = resolveOwnedTodo(todoId, user);

        if (StringUtils.hasText(request.text())) {
            String newText = request.text().trim();
            todo.setText(newText);
            // Re-classify when text changes (unless caller provides explicit category)
            if (request.category() == null) {
                todo.setCategory(classifierService.classify(newText));
            }
        }
        if (request.pinned() != null) {
            todo.setPinned(request.pinned());
        }
        if (request.completed() != null) {
            todo.setCompleted(request.completed());
        }
        if (request.category() != null) {
            todo.setCategory(StringUtils.hasText(request.category()) ? request.category().trim() : null);
        }
        if (request.reminderAt() != null) {
            // 0 or negative means "clear reminder"
            todo.setReminderAt(request.reminderAt() > 0 ? request.reminderAt() : null);
        }

        return TodoResponse.from(todoRepository.save(todo));
    }

    @Transactional
    public void deleteTodo(String username, UUID todoId) {
        User user = resolveUser(username);
        Todo todo = resolveOwnedTodo(todoId, user);
        todoRepository.delete(todo);
    }

    @Transactional
    public TodoResponse togglePin(String username, UUID todoId) {
        User user = resolveUser(username);
        Todo todo = resolveOwnedTodo(todoId, user);
        todo.setPinned(!todo.isPinned());
        return TodoResponse.from(todoRepository.save(todo));
    }

    @Transactional
    public TodoResponse toggleComplete(String username, UUID todoId) {
        User user = resolveUser(username);
        Todo todo = resolveOwnedTodo(todoId, user);
        todo.setCompleted(!todo.isCompleted());
        return TodoResponse.from(todoRepository.save(todo));
    }

    @Transactional
    public void clearCompleted(String username) {
        User user = resolveUser(username);
        todoRepository.deleteByUserAndCompletedTrue(user);
    }

    @Transactional
    public List<TodoResponse> importTodos(String username, List<TodoRequest> requests) {
        User user = resolveUser(username);

        return requests.stream()
                .filter(r -> StringUtils.hasText(r.text()))
                .map(r -> {
                    String text = r.text().trim();
                    String category = StringUtils.hasText(r.category())
                            ? r.category().trim()
                            : classifierService.classify(text);
                    Todo todo = Todo.builder()
                            .text(text)
                            .category(category)
                            .pinned(false)
                            .completed(false)
                            .createdAt(System.currentTimeMillis())
                            .user(user)
                            .build();
                    return TodoResponse.from(todoRepository.save(todo));
                })
                .toList();
    }
}
