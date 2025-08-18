package com.healthnest.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.lang.reflect.Field;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.exception.DoctorNotFoundException;
import com.healthnest.model.Doctor;
import com.healthnest.repository.DoctorRepository;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Spy
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @InjectMocks
    private DoctorService doctorService;
    
    private Doctor testDoctor;
    private DoctorDTO testDoctorDTO;
    
    @BeforeEach
    void setUp() {
        testDoctor = new Doctor();
        testDoctor.setDoctorId(1L);
        testDoctor.setDoctorName("Dr. Test");
        testDoctor.setEmailId("test@example.com");
        testDoctor.setDocPhnNo("1234567890");
        testDoctor.setConsultationFee(500.0);
        testDoctor.setRating(4.5F);
        testDoctor.setPassword("password");
        testDoctor.setSpecializedrole("Cardiology");
        testDoctor.setAvailability("Available");
        testDoctor.setHospitalName("Test Hospital");
        testDoctor.setExperience(5);
        testDoctor.setStatus(1);
        
        testDoctorDTO = new DoctorDTO();
        testDoctorDTO.setDoctorName("Dr. Updated");
        testDoctorDTO.setEmailId("updated@example.com");
        testDoctorDTO.setDocPhnNo("9876543210");
        testDoctorDTO.setConsultationFee(600.0);
        testDoctorDTO.setSpecializedrole("Neurology");
        testDoctorDTO.setAvailability("Unavailable");
        testDoctorDTO.setHospitalName("Updated Hospital");
        testDoctorDTO.setExperience(10);
    }
    
    @Test
    void testAddDoctor_Success() {
        when(doctorRepository.existsByEmailId(anyString())).thenReturn(false);
        when(doctorRepository.save(any(Doctor.class))).thenReturn(testDoctor);
        
        String result = doctorService.addDoctor(testDoctor);
        
        assertEquals("Saved Successfully", result);
        verify(doctorRepository).existsByEmailId(testDoctor.getEmailId());
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testAddDoctor_DuplicateEmail() {
        when(doctorRepository.existsByEmailId(anyString())).thenReturn(true);
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(testDoctor);
        });
        
        assertEquals("Doctor with the same email already exists", exception.getMessage());
        verify(doctorRepository).existsByEmailId(testDoctor.getEmailId());
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testValidateDoctor_NullDoctor() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(null);
        });
        
        assertEquals("Doctor cannot be null", exception.getMessage());
    }
    
    @Test
    void testValidateDoctor_EmptyName() {
        testDoctor.setDoctorName("");
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(testDoctor);
        });
        
        assertEquals("Doctor name cannot be empty", exception.getMessage());
    }
    
    @Test
    void testValidateDoctor_InvalidEmail() {
        testDoctor.setEmailId("invalid-email");
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(testDoctor);
        });
        
        assertEquals("Invalid email format", exception.getMessage());
    }
    
    @Test
    void testValidateDoctor_InvalidPhoneNumber() {
        testDoctor.setDocPhnNo("123");
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(testDoctor);
        });
        
        assertEquals("Phone number must be 10 digits", exception.getMessage());
    }
    
    @Test
    void testValidateDoctor_NegativeFee() {
        testDoctor.setConsultationFee(-100.0);
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(testDoctor);
        });
        
        assertEquals("Consultation fee cannot be negative", exception.getMessage());
    }
    
    @Test
    void testValidateDoctor_InvalidRating() {
        testDoctor.setRating(6.0F);
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.addDoctor(testDoctor);
        });
        
        assertEquals("Rating must be between 0 and 5", exception.getMessage());
    }
    
    @Test
    void testGetDoctorProfile_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        Doctor result = doctorService.getDoctorProfile(1L);
        
        assertEquals(testDoctor, result);
        verify(doctorRepository).findById(1L);
    }
    
    @Test
    void testGetDoctorProfile_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.getDoctorProfile(1L);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
    }
    
    @Test
    void testUpdateDoctorProfile_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.updateDoctorProfile(1L, testDoctorDTO);
        
        assertEquals("Updated Doctor Profile", result);
        assertEquals(testDoctorDTO.getDoctorName(), testDoctor.getDoctorName());
        assertEquals(testDoctorDTO.getHospitalName(), testDoctor.getHospitalName());
        assertEquals(testDoctorDTO.getExperience(), testDoctor.getExperience());
        assertEquals(testDoctorDTO.getConsultationFee(), testDoctor.getConsultationFee());
        assertEquals(testDoctorDTO.getEmailId(), testDoctor.getEmailId());
        assertEquals(testDoctorDTO.getDocPhnNo(), testDoctor.getDocPhnNo());
        assertEquals(testDoctorDTO.getAvailability(), testDoctor.getAvailability());
        assertEquals(testDoctorDTO.getSpecializedrole(), testDoctor.getSpecializedrole());
        
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateDoctorProfile_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.updateDoctorProfile(1L, testDoctorDTO);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testUpdateDoctorAvailability_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.updateDoctorAvailability(1L, "Unavailable");
        
        assertEquals("Availability updated successfully", result);
        assertEquals("Unavailable", testDoctor.getAvailability());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateDoctorAvailability_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.updateDoctorAvailability(1L, "Unavailable");
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testUpdateConsultationFee_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.updateConsultationFee(1L, 800.0);
        
        assertEquals("Consultation fee updated successfully", result);
        assertEquals(800.0, testDoctor.getConsultationFee());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateConsultationFee_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.updateConsultationFee(1L, 800.0);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testGetDoctorRating_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        Float result = doctorService.getDoctorRating(1L);
        
        assertEquals(4.5F, result);
        verify(doctorRepository).findById(1L);
    }
    
    @Test
    void testGetDoctorRating_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.getDoctorRating(1L);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
    }
    
    @Test
    void testFindDoctorsBySpecialization_Success() {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        when(doctorRepository.findBySpecializedroleContaining("Cardio")).thenReturn(doctors);
        
        List<Doctor> result = doctorService.findDoctorsBySpecialization("Cardio");
        
        assertEquals(1, result.size());
        assertEquals(testDoctor, result.get(0));
        verify(doctorRepository).findBySpecializedroleContaining("Cardio");
    }
    
    @Test
    void testAddSpecialization_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        when(doctorRepository.save(any(Doctor.class))).thenReturn(testDoctor);
        
        Doctor result = doctorService.addSpecialization(1L, "Pediatrics");
        
        assertEquals("Cardiology, Pediatrics", result.getSpecializedrole());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testAddSpecialization_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.addSpecialization(1L, "Pediatrics");
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testGetAllDoctors_Success() {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        when(doctorRepository.findAll()).thenReturn(doctors);
        
        List<Doctor> result = doctorService.getAllDoctors();
        
        assertEquals(1, result.size());
        assertEquals(testDoctor, result.get(0));
        verify(doctorRepository).findAll();
    }
    
    @Test
    void testDeleteAllDoctors_Success() {
        doNothing().when(doctorRepository).deleteAll();
        
        String result = doctorService.deleteAllDoctors();
        
        assertEquals("All doctors and their appointments deleted successfully", result);
        verify(doctorRepository).deleteAll();
    }
    
    @Test
    void testDeleteAllDoctors_Exception() {
        doThrow(new RuntimeException("DB error")).when(doctorRepository).deleteAll();
        
        Exception exception = assertThrows(RuntimeException.class, () -> {
            doctorService.deleteAllDoctors();
        });
        
        assertEquals("Failed to delete all doctors: DB error", exception.getMessage());
        verify(doctorRepository).deleteAll();
    }
    
    @Test
    void testGetDoctorPasswordHashByEmailId_Success() {
        when(doctorRepository.findByEmailId("test@example.com")).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.getDoctorPasswordHashByEmailId("test@example.com");
        
        assertEquals("password", result);
        verify(doctorRepository).findByEmailId("test@example.com");
    }
    
    @Test
    void testGetDoctorPasswordHashByEmailId_NotFound() {
        when(doctorRepository.findByEmailId("test@example.com")).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.getDoctorPasswordHashByEmailId("test@example.com");
        });
        
        assertEquals("Doctor not found with email: test@example.com", exception.getMessage());
        verify(doctorRepository).findByEmailId("test@example.com");
    }
    
    @Test
    void testGetDoctorNameByEmail_Success() {
        when(doctorRepository.findByEmailId("test@example.com")).thenReturn(Optional.of(testDoctor));
        
        Doctor result = doctorService.getDoctorNameByEmail("test@example.com");
        
        assertEquals(testDoctor, result);
        verify(doctorRepository).findByEmailId("test@example.com");
    }
    
    @Test
    void testGetDoctorNameByEmail_NotFound() {
        when(doctorRepository.findByEmailId("test@example.com")).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.getDoctorNameByEmail("test@example.com");
        });
        
        assertEquals("Doctor not found with email: test@example.com", exception.getMessage());
        verify(doctorRepository).findByEmailId("test@example.com");
    }
    
    @Test
    void testGetDoctorIdByEmail_Success() {
        when(doctorRepository.findByEmailId("test@example.com")).thenReturn(Optional.of(testDoctor));
        
        Doctor result = doctorService.getDoctorIdByEmail("test@example.com");
        
        assertEquals(testDoctor, result);
        verify(doctorRepository).findByEmailId("test@example.com");
    }
    
    @Test
    void testGetDoctorIdByEmail_NotFound() {
        when(doctorRepository.findByEmailId("test@example.com")).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.getDoctorIdByEmail("test@example.com");
        });
        
        assertEquals("Doctor not found with email: test@example.com", exception.getMessage());
        verify(doctorRepository).findByEmailId("test@example.com");
    }
    
    @Test
    void testUpdateDoctorStatus_Success() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        doctorService.updateDoctorStatus(1L, 0);
        
        assertEquals(0, testDoctor.getStatus());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateDoctorStatus_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.updateDoctorStatus(1L, 0);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testUpdateDoctorRating_NewRating() {
        testDoctor.setRating(null);
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.updateDoctorRating(1L, 4.0F);
        
        assertEquals("Rating updated successfully", result);
        assertEquals(4.0F, testDoctor.getRating());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateDoctorRating_ZeroRating() {
        testDoctor.setRating(0F);
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.updateDoctorRating(1L, 4.0F);
        
        assertEquals("Rating updated successfully", result);
        assertEquals(4.0F, testDoctor.getRating());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateDoctorRating_ExistingRating() {
        testDoctor.setRating(3.0F);
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        
        String result = doctorService.updateDoctorRating(1L, 5.0F);
        
        assertEquals("Rating updated successfully", result);
        assertEquals(4.0F, testDoctor.getRating()); 
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testUpdateDoctorRating_NotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.updateDoctorRating(1L, 4.0F);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }
    
    @Test
    void testDeleteDoctor_Success() {
        when(doctorRepository.existsById(1L)).thenReturn(true);
        doNothing().when(doctorRepository).deleteById(1L);
        
        doctorService.deleteDoctor(1L);
        
        verify(doctorRepository).existsById(1L);
        verify(doctorRepository).deleteById(1L);
    }
    
    @Test
    void testDeleteDoctor_NotFound() {
        when(doctorRepository.existsById(1L)).thenReturn(false);
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.deleteDoctor(1L);
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).existsById(1L);
        verify(doctorRepository, never()).deleteById(anyLong());
    }
    
    @Test
    void testChangePassword_Success() {
        BCryptPasswordEncoder encoder = mock(BCryptPasswordEncoder.class);
        String encodedOldPassword = "encodedOldPassword";
        testDoctor.setPassword(encodedOldPassword);
        
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        when(encoder.matches("oldPassword", encodedOldPassword)).thenReturn(true);
        when(encoder.encode("newPassword")).thenReturn("encodedNewPassword");
        
        
        try {
            Field field = DoctorService.class.getDeclaredField("passwordEncoder");
            field.setAccessible(true);
            field.set(doctorService, encoder);
        } catch (Exception e) {
            fail("Failed to set passwordEncoder field: " + e.getMessage());
        }
        
        String result = doctorService.changePassword(1L, "oldPassword", "newPassword");
        
        assertEquals("Password changed successfully", result);
        assertEquals("encodedNewPassword", testDoctor.getPassword());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository).save(testDoctor);
        verify(encoder).matches("oldPassword", encodedOldPassword);
        verify(encoder).encode("newPassword");
    }
    
    @Test
    void testChangePassword_IncorrectOldPassword() {
        BCryptPasswordEncoder encoder = mock(BCryptPasswordEncoder.class);
        String encodedOldPassword = "encodedOldPassword";
        testDoctor.setPassword(encodedOldPassword);
        
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(testDoctor));
        when(encoder.matches("wrongPassword", encodedOldPassword)).thenReturn(false);
        
        
        try {
            Field field = DoctorService.class.getDeclaredField("passwordEncoder");
            field.setAccessible(true);
            field.set(doctorService, encoder);
        } catch (Exception e) {
            fail("Failed to set passwordEncoder field: " + e.getMessage());
        }
        
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            doctorService.changePassword(1L, "wrongPassword", "newPassword");
        });
        
        assertEquals("Current password is incorrect", exception.getMessage());
        assertEquals(encodedOldPassword, testDoctor.getPassword());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
        verify(encoder).matches("wrongPassword", encodedOldPassword);
        verify(encoder, never()).encode(anyString());
    }
    
    @Test
    void testChangePassword_DoctorNotFound() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.empty());
        
        Exception exception = assertThrows(DoctorNotFoundException.class, () -> {
            doctorService.changePassword(1L, "oldPassword", "newPassword");
        });
        
        assertEquals("Doctor not found with id: 1", exception.getMessage());
        verify(doctorRepository).findById(1L);
        verify(doctorRepository, never()).save(any(Doctor.class));
    }

    @Test
    void testSetNewPassword_Success() {
        // Arrange
        String email = "doctor@example.com";
        String newPassword = "newPassword123";
        
        when(doctorRepository.findByEmailId(email)).thenReturn(Optional.of(testDoctor));
        
        // Act
        boolean result = doctorService.setNewPassword(email, newPassword);
        
        // Assert
        assertTrue(result);
        assertTrue(passwordEncoder.matches(newPassword, testDoctor.getPassword()));
        verify(doctorRepository).save(testDoctor);
    }
    
    @Test
    void testSetNewPassword_DoctorNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        String newPassword = "newPassword123";
        
        when(doctorRepository.findByEmailId(email)).thenReturn(Optional.empty());
        
        // Act & Assert
        DoctorNotFoundException exception = assertThrows(DoctorNotFoundException.class, 
            () -> doctorService.setNewPassword(email, newPassword));
        
        assertEquals("Doctor not found with email: " + email, exception.getMessage());
        verify(doctorRepository, never()).save(any());
    }
    
    @Test
    void testSetNewPassword_PasswordTooShort() {
        // Arrange
        String email = "doctor@example.com";
        String newPassword = "short"; // Less than 6 characters
        
        when(doctorRepository.findByEmailId(email)).thenReturn(Optional.of(testDoctor));
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> doctorService.setNewPassword(email, newPassword));
        
        assertEquals("New password must be at least 6 characters long", exception.getMessage());
        verify(doctorRepository, never()).save(any());
    }
}