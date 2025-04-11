package com.healthnest.controller;

import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.exception.AuthenticationException;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthenticationController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/doctor-signup")
    public ResponseEntity<String> signUpDoctor(@RequestBody DoctorDTO doctorDTO) {
        try {
            Doctor doctor = modelMapper.map(doctorDTO, Doctor.class);
            doctor.setPassword(hashPassword(doctor.getPassword()));
            String result = doctorService.addDoctor(doctor);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during signup");
        }
    }

    @PostMapping("/doctor-login")
    public ResponseEntity<Object> doctorLogin(@RequestBody DoctorDTO doctor) {
        if (doctor.getEmailId() == null || doctor.getPassword() == null) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }

        String storedHashedPassword = doctorService.getDoctorPasswordHashByEmailId(doctor.getEmailId());
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        
        if (!passwordEncoder.matches(doctor.getPassword(), storedHashedPassword)) {
            throw new AuthenticationException("Invalid email or password");
        }

        Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(doctor.getEmailId());
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "userId", authenticatedDoctor.getDoctorId(),
            "name", authenticatedDoctor.getDoctorName()
        ));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<Object> adminLogin(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password must not be empty");
        }
        
        final String ADMIN_USERNAME = "admin";
        final String ADMIN_PASSWORD = "admin";

        if (username.equals(ADMIN_USERNAME) && password.equals(ADMIN_PASSWORD)) {
            return ResponseEntity.ok(Map.of(
                "message", "Admin login successful",
                "role", "ADMIN"
            ));
        }
        throw new AuthenticationException("Invalid credentials");
    }

    private String hashPassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }
}