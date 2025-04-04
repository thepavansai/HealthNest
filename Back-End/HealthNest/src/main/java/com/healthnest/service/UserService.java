package com.healthnest.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.UserRepository;
import com.healthnest.dto.enums.Gender;
import com.healthnest.model.User;

import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
@Service
@Transactional
//@RequiredArgsConstructor
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
	
	public User editProfile(User userchange)
	{
		Optional<User> user= userRepository.findById(userchange.getUserId());
		user.get().setName(userchange.getName());
		user.get().setGender(userchange.getGender());
		user.get().setEmail(userchange.getEmail());
		user.get().setDateOfBirth(userchange.getDateOfBirth());
		user.get().setPhoneNo(userchange.getPhoneNo());
		
		return user.get();
		
	
		
		
	}
    }
