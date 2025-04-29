package com.healthnest.repository;
import com.healthnest.model.User;


import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends CrudRepository<User, Long> {  // Changed from Integer to Long
    // Use the actual property name from the entity class, not the DB column name
    Optional<User> findByEmail(String email);
}

