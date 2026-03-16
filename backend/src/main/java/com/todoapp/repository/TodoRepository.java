package com.todoapp.repository;

import com.todoapp.model.Todo;
import com.todoapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TodoRepository extends JpaRepository<Todo, UUID> {

    List<Todo> findByUserOrderByPinnedDescCreatedAtDesc(User user);

    Optional<Todo> findByIdAndUser(UUID id, User user);

    void deleteByUserAndCompletedTrue(User user);

    List<Todo> findByUser(User user);
}
