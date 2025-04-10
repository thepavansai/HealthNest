package com.healthnest.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.healthnest.model.Doctor;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.UserService;

@CrossOrigin(origins = "http://localhost:3000")
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
    public List<UserDTO> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/doctors")
    public List<DoctorDTO> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return doctors.stream().map(doctor -> modelMapper.map(doctor, DoctorDTO.class)).collect(Collectors.toList());
    }

    @DeleteMapping("/users/delete")
    public String deleteAllUsers() {
        return userService.deleteAllUsers();
    }

    @DeleteMapping("/doctors/delete")
    public String deleteAllDoctors() {
        return doctorService.deleteAllDoctors();
    }

    @GetMapping("/appointments")
    public List<AppointmentShowDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @DeleteMapping("/appointments/delete")
    public String deleteAppointment() {
        return appointmentService.deleteAllAppointments();
    }

    @DeleteMapping("/appointments/{id}")
    public String deleteAppointment(@PathVariable("id") Integer appointmentId) {
        return appointmentService.deleteAppointment(appointmentId);
    }

    @GetMapping("/feedbacks")
    public List<FeedBackDTO> getAllFeedBacks() {
        return feedBackService.getAllFeedBack();
    }

    @PutMapping("/doctors/{doctorId}/accept")
    public ResponseEntity<String> acceptDoctor(@PathVariable Long doctorId) {
        try {
            doctorService.updateDoctorStatus(doctorId, 1);
            return ResponseEntity.ok("Doctor accepted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found with id: " + doctorId);
        }
    }

    @PutMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<String> rejectDoctor(@PathVariable Long doctorId) {
        try {
            doctorService.updateDoctorStatus(doctorId, -1);
            return ResponseEntity.ok("Doctor rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found with id: " + doctorId);
        }
    }
}
