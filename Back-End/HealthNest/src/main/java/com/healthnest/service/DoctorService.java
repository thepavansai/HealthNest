package com.healthnest.service;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.model.Doctor;
import com.healthnest.Repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // View Doctor Profile
    public DoctorDTO getDoctorProfile(Long doctorId) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        return doctor.map(this::convertToDTO).orElse(null);
    }

    // Update Doctor Profile
    public DoctorDTO updateDoctorProfile(Long doctorId, DoctorDTO doctorDTO) {
        Optional<Doctor> existingDoctor = doctorRepository.findById(doctorId);
        if (existingDoctor.isPresent()) {
            Doctor doctor = existingDoctor.get();
            doctor.setDoctorName(doctorDTO.getDoctorName());
//            doctor.setEmailId(doctorDTO.getEmailId()); // getEmailId() is missing
            doctor.setSpecialization(doctorDTO.getSpecialization());
            doctor.setDocPhnNo(doctorDTO.getDocPhnNo());
//            doctor.setHospitalName(doctorDTO.getHospitalName()); //getHospitalName is missing
            doctor.setExperience(doctorDTO.getExperience());
            doctorRepository.save(doctor);
            return convertToDTO(doctor);
        }
        return null;
    }

    // Update Availability
    public String updateDoctorAvailability(Long doctorId, boolean isAvailable) {
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
    public String getDoctorReviews(Long doctorId) {
        return "Doctor ratings and feedback fetched successfully.";
    }

    // Convert Doctor Entity to DoctorDTO
    private DoctorDTO convertToDTO(Doctor doctor) {

        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorId(doctor.getDoctorId());
        dto.setDoctorName(doctor.getDoctorName());
        dto.setSpecialization(doctor.getSpecialization());
//        dto.setEmailId(doctor.getEmailId());  // getEmailId() is missing
        dto.setDocPhnNo(doctor.getDocPhnNo());
//        dto.setHospitalId(doctor.getHospital().hospitalId); //Function in Hospital Class are missing
        dto.setExperience(doctor.getExperience());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setAvailability(doctor.isAvailability());
        dto.setRating(doctor.getRating());
        return dto;
    }
}
