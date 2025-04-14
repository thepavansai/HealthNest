package com.healthnest.service;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.enums.Gender;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.repository.DoctorRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DoctorServiceTest {

    @InjectMocks
    private DoctorService doctorService;

    @Mock
    private DoctorRepository doctorRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddDoctor_NewDoctor() {
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. John");
        doctor.setEmailId("john@example.com");

        when(doctorRepository.existsByEmailId("john@example.com")).thenReturn(false);
        when(doctorRepository.save(any(Doctor.class))).thenReturn(doctor);

        String result = doctorService.addDoctor(doctor);
        assertEquals("Saved Successfully", result);
    }

    @Test
    void testAddDoctor_ExistingDoctor() {
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. John");
        doctor.setEmailId("john@example.com");

        when(doctorRepository.existsByEmailId("john@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> doctorService.addDoctor(doctor));
    }

    @Test
    void testGetDoctorProfile() {
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. Smith");
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));

        Doctor result = doctorService.getDoctorProfile(1L);
        assertEquals("Dr. Smith", result.getDoctorName());
    }

    @Test
    void testUpdateDoctorProfile_AllFields() {
        DoctorDTO dto = new DoctorDTO();
        dto.setDoctorName("Updated Name");
        dto.setHospitalName("Updated Hospital");
        dto.setExperience(15);
        dto.setGender(Gender.MALE);
        dto.setEmailId("updated@example.com");
        dto.setPassword("newpass123");
        dto.setSpecializedrole("Cardiologist");
        dto.setDocPhnNo("9876543210");
        dto.setConsultationFee(750.0);
        dto.setRating(4);
        dto.setAvailability("Available");
        dto.setStatus(1);

        Doctor existingDoctor = new Doctor();
        existingDoctor.setDoctorName("Old Name");

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(existingDoctor));

        String result = doctorService.updateDoctorProfile(1L, dto);
        assertEquals("Updated Doctor Profile", result);

        verify(doctorRepository).save(argThat(updated -> 
            updated.getDoctorName().equals("Updated Name") &&
            updated.getHospitalName().equals("Updated Hospital") &&
            updated.getExperience().equals(15)
            
        ));
    }

    @Test
    void testUpdateDoctorProfile_DoctorNotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(DoctorNotFoundException.class, () -> doctorService.updateDoctorProfile(1L, new DoctorDTO()));
    }

    @Test
    void testUpdateDoctorAvailability() {
        Doctor doctor = new Doctor();
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));

        String result = doctorService.updateDoctorAvailability(1L, "Busy");
        assertEquals("Availability updated successfully", result);
        assertEquals("Busy", doctor.getAvailability());
    }

    @Test
    void testUpdateConsultationFee() {
        Doctor doctor = new Doctor();
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));

        String result = doctorService.updateConsultationFee(1L, 300.0);
        assertEquals("Consultation fee updated successfully", result);
        assertEquals(300.0, doctor.getConsultationFee());
    }

    @Test
    void testGetDoctorRating() {
        Doctor doctor = new Doctor();
        doctor.setRating(4.5f);

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        Float rating = doctorService.getDoctorRating(1L);

        assertEquals(4.5f, rating);
    }

    @Test
    void testFindDoctorsBySpecialization() {
        Doctor doc1 = new Doctor();
        doc1.setSpecializedrole("Cardiologist");

        when(doctorRepository.findBySpecializedroleContaining("Cardio"))
                .thenReturn(List.of(doc1));

        List<Doctor> doctors = doctorService.findDoctorsBySpecialization("Cardio");
        assertEquals(1, doctors.size());
    }

    @Test
    void testAddSpecialization() {
        Doctor doctor = new Doctor();
        doctor.setSpecializedrole("Dermatologist");

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(doctorRepository.save(any())).thenReturn(doctor);

        Doctor updated = doctorService.addSpecialization(1L, "Allergist");
        assertTrue(updated.getSpecializedrole().contains("Allergist"));
    }

    @Test
    void testGetAllDoctors() {
        when(doctorRepository.findAll()).thenReturn(Arrays.asList(new Doctor(), new Doctor()));
        List<Doctor> doctors = doctorService.getAllDoctors();
        assertEquals(2, doctors.size());
    }

    @Test
    void testDeleteAllDoctors() {
        when(doctorRepository.findAll()).thenReturn(Arrays.asList(new Doctor()));
        String response = doctorService.deleteAllDoctors();
        verify(doctorRepository, times(1)).deleteAll();
        assertEquals("All doctors and their appointments deleted successfully", response);
    }

    @Test
    void testGetDoctorPasswordHashByEmailId() {
        Doctor doctor = new Doctor();
        doctor.setPassword("hashed123");

        when(doctorRepository.findByEmailId("doc@example.com")).thenReturn(Optional.of(doctor));
        assertEquals("hashed123", doctorService.getDoctorPasswordHashByEmailId("doc@example.com"));
    }

    @Test
    void testGetDoctorNameByEmail() {
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. A");

        when(doctorRepository.findByEmailId("doc@example.com")).thenReturn(Optional.of(doctor));
        Doctor result = doctorService.getDoctorNameByEmail("doc@example.com");

        assertEquals("Dr. A", result.getDoctorName());
    }

    @Test
    void testUpdateDoctorStatus_Success() {
        Doctor doctor = new Doctor();
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));

        doctorService.updateDoctorStatus(1L, 1);
        assertEquals(1, doctor.getStatus());
    }

    @Test
    void testUpdateDoctorStatus_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(DoctorNotFoundException.class, () -> doctorService.updateDoctorStatus(1L, 1));
    }

    @Test
    void testChangePassword_Success() {
        Doctor doctor = new Doctor();
        doctor.setPassword("oldPassword");
        
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        
        String result = doctorService.changePassword(1L, "oldPassword", "newPassword");
        
        assertEquals("Password changed successfully", result);
        assertEquals("newPassword", doctor.getPassword());
        verify(doctorRepository).save(doctor);
    }

    @Test
    void testChangePassword_WrongOldPassword() {
        Doctor doctor = new Doctor();
        doctor.setPassword("correctPassword");
        
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        
        assertThrows(IllegalArgumentException.class, () -> 
            doctorService.changePassword(1L, "wrongPassword", "newPassword"));
    }

    @Test
    void testChangePassword_DoctorNotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(DoctorNotFoundException.class, () -> 
            doctorService.changePassword(1L, "oldPassword", "newPassword"));
    }
}
