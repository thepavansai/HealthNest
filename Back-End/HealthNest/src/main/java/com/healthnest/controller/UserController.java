package com.healthnest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.model.User;
import com.healthnest.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired UserService userService;
	
	@PostMapping("/Signup")
	public String cerateAccount(@RequestBody User user)
	{
		userService.createUser(user);
		return "Succesfully account created";
	}

}
