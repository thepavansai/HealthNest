package com.healthnest.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.UserDTO;
import com.healthnest.model.User;
import com.healthnest.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired 
	UserService userService;
    @Autowired
    private ModelMapper modelMapper;

	@PostMapping("/Signup")
	public ResponseEntity<String> createAccount(@RequestBody UserDTO userdto)
	{	User user= modelMapper.map(userdto, User.class);
		if(userService.isUserAlreadyRegistered(user.getEmail()))
		{
		 return ResponseEntity.badRequest().body("User already registered!");
        }
        userService.createUser(user);
        return ResponseEntity.ok("User registered successfully!");
		}
	@PatchMapping("/editprofile")
	public ResponseEntity<User> editprofile(@RequestBody User user)
	{
		User userafter=userService.editProfile( user);
		return ResponseEntity.ok(userafter);
		
	}
	
		
	}


