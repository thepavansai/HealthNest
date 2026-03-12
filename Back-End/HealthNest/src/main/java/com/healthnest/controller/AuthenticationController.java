package com.healthnest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.exception.AuthenticationException;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;
import com.healthnest.service.JWTService;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@CrossOrigin(origins = "https://health-nest.netlify.app")
@RestController
@RequestMapping("/v1")
public class AuthenticationController {
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private JWTService jwtService;
    
    @Autowired
    private AuthenticationConfiguration authConfig;

    @Value("${admin.username}")
    private String adminUsername;
    
    @Value("${admin.password}")
    private String adminPassword;

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

//    @PostMapping("/doctor-login")
//    public ResponseEntity<Map<String, String>> doctorLogin(@RequestBody DoctorDTO doctor) {
//        Map<String, String> response = new HashMap<>();
//        
//        if (doctor.getEmailId() == null || doctor.getPassword() == null ||
//            doctor.getEmailId().trim().isEmpty() || doctor.getPassword().trim().isEmpty()) {
//            throw new IllegalArgumentException("Email and password must not be empty");
//        }
//        
//        try {
//            String storedHashedPassword = doctorService.getDoctorPasswordHashByEmailId(doctor.getEmailId());
//            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//            
//            if (!passwordEncoder.matches(doctor.getPassword(), storedHashedPassword)) {
//                throw new AuthenticationException("Invalid email or password");
//            }
//            
//            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(doctor.getEmailId());
//            
//            // Generate JWT token with DOCTOR role
//            String token = jwtService.generateToken(doctor.getEmailId(), "DOCTOR");
//            
//            response.put("message", "Login successful");
//            response.put("userId", String.valueOf(authenticatedDoctor.getDoctorId()));
//            response.put("name", authenticatedDoctor.getDoctorName());
//            response.put("token", token);
//            response.put("role", "DOCTOR");
//            
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            response.put("message", e.getMessage());
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//        }
//    }
    @PostMapping("/doctor-login")
    public ResponseEntity<Map<String, String>> doctorLogin(@RequestBody DoctorDTO doctor) {
        Map<String, String> response = new HashMap<>();
        
        if (doctor.getEmailId() == null || doctor.getPassword() == null ||
            doctor.getEmailId().trim().isEmpty() || doctor.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Email and password must not be empty");
        }
        
        try {
            String storedHashedPassword = doctorService.getDoctorPasswordHashByEmailId(doctor.getEmailId());
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            
            if (!passwordEncoder.matches(doctor.getPassword(), storedHashedPassword)) {
                throw new AuthenticationException("Invalid email or password");
            }
            
            Doctor authenticatedDoctor = doctorService.getDoctorIdByEmail(doctor.getEmailId());
            
            // --- NEW STATUS CHECK LOGIC ---
            if (authenticatedDoctor.getStatus() == 0) {
                response.put("message", "Your account is pending approval. Please wait until the Admin approves you.");
                // Returning 403 Forbidden is the standard way to say "I know you, but you're not allowed yet"
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            // ------------------------------

            // Generate JWT token with DOCTOR role
            String token = jwtService.generateToken(doctor.getEmailId(), "DOCTOR");
            
            response.put("message", "Login successful");
            response.put("userId", String.valueOf(authenticatedDoctor.getDoctorId()));
            response.put("name", authenticatedDoctor.getDoctorName());
            response.put("token", token);
            response.put("role", "DOCTOR");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/admin-login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Map<String, String> credentials) {
        Map<String, String> response = new HashMap<>();
        
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || password == null) {
            throw new IllegalArgumentException("Username and password must not be empty");
        }
        
        if (username.equals(adminUsername) && password.equals(adminPassword)) {
            String token = jwtService.generateToken(username, "ADMIN");
            
            response.put("message", "Admin login successful");
            response.put("role", "ADMIN");
            response.put("token", token);
            
            return ResponseEntity.ok(response);
        }
        
        throw new AuthenticationException("Invalid credentials");
    }

    private String hashPassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }
    
    @PostMapping("/bulk-doctor-signup")
    public ResponseEntity<String> bulkSignUpDoctors(@RequestBody List<DoctorDTO> doctorDTOs) {
        try {
            int count = 0;
            for (DoctorDTO doctorDTO : doctorDTOs) {
                Doctor doctor = modelMapper.map(doctorDTO, Doctor.class);
                // Hash the password for each doctor
                doctor.setPassword(hashPassword(doctor.getPassword()));
                
                // Save the doctor
                doctorService.addDoctor(doctor); 
                count++;
            }
            return ResponseEntity.ok("Successfully registered " + count + " doctors.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during bulk signup: " + e.getMessage());
        }
    }
}
