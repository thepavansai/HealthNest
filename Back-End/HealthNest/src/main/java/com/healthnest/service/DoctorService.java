package com.healthnest.service;

import com.healthnest.model.Doctor;
import com.healthnest.Repository.DoctorRepository;
import com.healthnest.dto.DoctorDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor getDoctorProfile(Long doctorId) {
        return doctorRepository.findById(doctorId).get();
    }
    public String updateDoctorProfile(Long doctorId, DoctorDTO doctorDTO) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);

        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setDoctorName(doctorDTO.getDoctorName());
            doctor.setHospitalName(doctorDTO.getHospitalName());
            doctor.setExperience(doctorDTO.getExperience());
            doctorRepository.save(doctor);
            return "Updated Doctor Profile";
        }

        return "Doctor not found";
    }

    // Update Availability
    public String updateDoctorAvailability(Long doctorId, String isAvailable) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        if (doctor.isPresent()) {
            doctor.get().setAvailability(isAvailable);
            doctorRepository.save(doctor.get());
            return "Availability updated successfully";
        }
        return "Doctor not found";
    }

    // Update Consultation Fee
    public String updateConsultationFee(Long doctorId, Double fee) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        if (doctor.isPresent()) {
            doctor.get().setConsultationFee(fee);
            doctorRepository.save(doctor.get());
            return "Consultation fee updated successfully";
        }
        return "Doctor not found";
    }

    // View Doctor Reviews (Dummy Data since no review entity was given)
    public Float getDoctorRating(Long doctorId) {
        return doctorRepository.findById(doctorId).get().getRating();

    }
}
