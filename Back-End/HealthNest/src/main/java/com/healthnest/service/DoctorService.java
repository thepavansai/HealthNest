package com.healthnest.service;

import com.healthnest.model.Doctor;
import com.healthnest.repository.DoctorRepository;
import com.healthnest.dto.DoctorDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    
    public String addDoctor(Doctor doctor) {
        if (doctorRepository.existsByDoctorNameAndEmailId(doctor.getDoctorName(), doctor.getEmailId())) {
            return "Doctor with the same name and email already exists.";
        }
        doctorRepository.save(doctor);
        return "Saved Successfully";
    }
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
    // View Doctor Ratings
    public Float getDoctorRating(Long doctorId) {
        return doctorRepository.findById(doctorId).get().getRating();

    }
    public List<Doctor> findDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializedroleContaining(specialization);
    }

    public Doctor addSpecialization(Long doctorId, String newSpecialization) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        String updatedSpecialization = doctor.getSpecializedrole() + ", " + newSpecialization;
        doctor.setSpecializedrole(updatedSpecialization);
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public String deleteAllDoctors() {
        doctorRepository.deleteAll();
        return "All doctors deleted";
    }
    public String getDoctorPasswordHashByEmailId(String emailId) {
        Optional<Doctor> doctor = doctorRepository.findByEmailId(emailId);
        return doctor.map(Doctor::getPassword).orElse(null);
    }
	public Doctor getDoctorNameByEmail(String emailId) {
		return doctorRepository.findByEmailId(emailId).get();
		
	}
	public Doctor getDoctorIdByEmail(String emailId) {
		return doctorRepository.findByEmailId(emailId).get();
	}
}
