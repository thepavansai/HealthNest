package com.healthnest.service;

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
		userRepository.save(user);	
	}
//
//	public void createUser(User user) {
//		// TODO Auto-generated method stub
//		
//	}

}
