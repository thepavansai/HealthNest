package com.healthnest.service;

import com.healthnest.model.Doctor;
import com.healthnest.repository.DoctorRepository;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.exception.DoctorNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    
    public String addDoctor(Doctor doctor) {
        if (doctor == null) {
            throw new IllegalArgumentException("Doctor cannot be null");
        }
        if (doctorRepository.existsByEmailId(doctor.getEmailId())) {
            throw new IllegalArgumentException("Doctor with the same email already exists");
        }
        doctorRepository.save(doctor);
        return "Saved Successfully";
    }
    
    public Doctor getDoctorProfile(Long doctorId) {
        return doctorRepository.findById(doctorId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));
    }
    
    public String updateDoctorProfile(Long doctorId, DoctorDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));
        doctor.setDoctorName(doctorDTO.getDoctorName());
        doctor.setHospitalName(doctorDTO.getHospitalName());
        doctor.setExperience(doctorDTO.getExperience());
        doctor.setConsultationFee(doctorDTO.getConsultationFee());
        doctor.setEmailId(doctorDTO.getEmailId());
        doctor.setDocPhnNo(doctorDTO.getDocPhnNo());
        doctor.setAvailability(doctorDTO.getAvailability());
        doctor.setSpecializedrole(doctorDTO.getSpecializedrole());
        doctorRepository.save(doctor);
        return "Updated Doctor Profile";
    }
    
    public String updateDoctorAvailability(Long doctorId, String isAvailable) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));
        
        doctor.setAvailability(isAvailable);
        doctorRepository.save(doctor);
        return "Availability updated successfully";
    }
    
    public String updateConsultationFee(Long doctorId, Double fee) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));
        
        doctor.setConsultationFee(fee);
        doctorRepository.save(doctor);
        return "Consultation fee updated successfully";
    }
    
    public Float getDoctorRating(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));
        return doctor.getRating();
    }
    
    public List<Doctor> findDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializedroleContaining(specialization);
    }
    
    public Doctor addSpecialization(Long doctorId, String newSpecialization) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + doctorId));
        
        String updatedSpecialization = doctor.getSpecializedrole() + ", " + newSpecialization;
        doctor.setSpecializedrole(updatedSpecialization);
        return doctorRepository.save(doctor);
    }
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public String deleteAllDoctors() {
        try {
            doctorRepository.deleteAll();
            return "All doctors and their appointments deleted successfully";
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete all doctors: " + e.getMessage());
        }
    }
    
    public String getDoctorPasswordHashByEmailId(String emailId) {
        return doctorRepository.findByEmailId(emailId)
            .map(Doctor::getPassword)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with email: " + emailId));
    }
    
    public Doctor getDoctorNameByEmail(String emailId) {
        return doctorRepository.findByEmailId(emailId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with email: " + emailId));
    }
    
    public Doctor getDoctorIdByEmail(String emailId) {
        return doctorRepository.findByEmailId(emailId)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with email: " + emailId));
    }
    
    public void updateDoctorStatus(Long doctorId, int status) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setStatus(status);
            doctorRepository.save(doctor);
        } else {
            throw new DoctorNotFoundException("Doctor not found with id: " + doctorId);
        }
    }
    
    public String updateDoctorRating(Long id, Float rating) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id: " + id));
        
        Float initialRating = doctor.getRating();
        if (initialRating == null || initialRating == 0) {
            doctor.setRating(rating);
        } else {
            doctor.setRating((initialRating + rating) / 2);
        }
        doctorRepository.save(doctor);
        return "Rating updated successfully";
    }
    
    public void deleteDoctor(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new DoctorNotFoundException("Doctor not found with id: " + doctorId);
        }
        doctorRepository.deleteById(doctorId);
    }
}
