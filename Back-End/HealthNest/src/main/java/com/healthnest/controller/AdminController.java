package com.healthnest.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.UserDTO;

import com.healthnest.model.User;
import com.healthnest.service.DoctorService;
import com.healthnest.service.UserService;


@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private DoctorService doctorService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                    .map(user -> modelMapper.map(user, UserDTO.class))
                    .collect(Collectors.toList());
    }

    @GetMapping("/doctors")
    public List<DoctorDTO> getAllDoctors(){
        List<Doctor> doctors = doctorService.getAllDoctors();
        return doctors.stream().map(doctor -> modelMapper.map(doctor, DoctorDTO.class)).collect(Collectors.toList());
    }
}
