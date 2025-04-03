package com.healthnest.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.UserRepository;
import com.healthnest.model.User;

import jakarta.transaction.Transactional;
@Service
@Transactional
public class UserService {
	
	@Autowired UserRepository userRepository;
	
	public void createUser(User user)
	{
		if (isUserAlreadyRegistered(user.getEmail())) {
            throw new RuntimeException("User already exists!");
        }
        userRepository.save(user);	
	}	
	public boolean isUserAlreadyRegistered(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();
    }
    }
