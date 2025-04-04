package com.healthnest.controller;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;
    @GetMapping("/users")
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/doctors")
    public List<DoctorDTO> getAllDoctors(){
        return null;
    }
}
