package com.healthnest.controller;

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
    public ResponseEntity<String> doctorLogin(@RequestBody DoctorDTO doctor) {
        if (doctor.getEmailId() == null || doctor.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password must not be empty");
        }

        try {
            String storedHashedPassword = doctorService.getDoctorPasswordHashByEmailId(doctor.getEmailId());
            if (storedHashedPassword == null) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (passwordEncoder.matches(doctor.getPassword(), storedHashedPassword)) {
                return ResponseEntity.ok("Login successful");
            } else {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }
        } catch (Exception e) {
            // Log the exception (consider using a logger)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }

    private String hashPassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }
}