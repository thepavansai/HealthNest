package com.healthnest.controller;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private ModelMapper modelMapper;
    
    @PostMapping("/signup")
    public String singUpDoctor(@RequestBody DoctorDTO doctordto) {
    	return doctorService.saveDoctor(modelMapper.map(doctordto, Doctor.class));
    }
    
    @GetMapping("/profile/{id}")
    public DoctorDTO getDoctorProfile(@PathVariable Long id) {
        return modelMapper.map(doctorService.getDoctorProfile(id), DoctorDTO.class);
    }

    @PutMapping("/profile/{id}")
    public String updateDoctorProfile(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        return doctorService.updateDoctorProfile(id, doctorDTO);
    }

    @PatchMapping("/{id}/availability")
    public String updateDoctorAvailability(@PathVariable Long id, @RequestParam String availability) {
        return doctorService.updateDoctorAvailability(id, availability);
    }

    @PatchMapping("/{id}/consultation-fee")
    public String updateConsultationFee(@PathVariable Long id, @RequestParam Double fee) {
        return doctorService.updateConsultationFee(id, fee);
    }

    @GetMapping("/{id}/rating")
    public Float getDoctorReviews(@PathVariable Long id) {
        return doctorService.getDoctorRating(id);
    }

    @GetMapping("/specialization")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@RequestParam String specialization) {
        List<Doctor> doctors = doctorService.findDoctorsBySpecialization(specialization);
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(doctor -> modelMapper.map(doctor, DoctorDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @PutMapping("/{doctorId}/specialization")
    public ResponseEntity<DoctorDTO> addSpecialization(@PathVariable Long doctorId, @RequestParam String newSpecialization) {
        Doctor updatedDoctor = doctorService.addSpecialization(doctorId, newSpecialization);
        DoctorDTO updatedDoctorDTO = modelMapper.map(updatedDoctor, DoctorDTO.class);
        return ResponseEntity.ok(updatedDoctorDTO);
    }

}