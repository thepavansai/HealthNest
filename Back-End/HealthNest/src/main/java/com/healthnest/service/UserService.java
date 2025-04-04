package com.healthnest.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthnest.Repository.UserRepository;
import com.healthnest.dto.UserDTO;
import com.healthnest.model.User;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
//@RequiredArgsConstructor
public class UserService {
	
	@Autowired
    UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

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
