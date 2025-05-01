package com.healthnest.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnest.dto.AppointmentShowDTO;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.UserService;

@CrossOrigin(origins = {"http://localhost:3000", "https://health-nest.netlify.app/"})
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;
    @Autowired
    private DoctorService doctorService;
    @Autowired
    AppointmentService appointmentService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private FeedBackService feedBackService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @DeleteMapping("/users/delete")
    public ResponseEntity<String> deleteAllUsers() {
        String result = userService.deleteAllUsers();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/doctors/delete")
    public ResponseEntity<String> deleteAllDoctors() {
        String result = doctorService.deleteAllDoctors();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentShowDTO>> getAllAppointments() {
        List<AppointmentShowDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/appointments/delete")
    public ResponseEntity<String> deleteAppointment() {
        String result = appointmentService.deleteAllAppointments();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable("id") Long appointmentId) {  // Changed from Integer to Long
        String result = appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<FeedBackDTO>> getAllFeedBacks() {
        List<FeedBackDTO> feedbacks = feedBackService.getAllFeedBack();
        return ResponseEntity.ok(feedbacks);
    }

    @PutMapping("/doctors/{doctorId}/accept")
    public ResponseEntity<String> acceptDoctor(@PathVariable Long doctorId) {
        doctorService.updateDoctorStatus(doctorId, 1);
        return ResponseEntity.ok("Doctor accepted successfully");
    }

    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<String> rejectDoctor(@PathVariable Long doctorId) {
        doctorService.updateDoctorStatus(doctorId, -1);
        return ResponseEntity.ok("Doctor rejected successfully");
    }

    @DeleteMapping("/doctors/{doctorId}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long doctorId) {
        try {
            doctorService.deleteDoctor(doctorId);
            return ResponseEntity.ok("Doctor deleted successfully");
        } catch (DoctorNotFoundException ex) {
            throw new DoctorNotFoundException("Doctor not found with id: " + doctorId);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {  // Changed from Integer to Long
        try {
            userService.deleteAccount(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (UserNotFoundException ex) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
    }
}
