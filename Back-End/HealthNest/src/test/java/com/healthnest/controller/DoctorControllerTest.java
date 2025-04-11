package com.healthnest.controller;

import com.healthnest.dto.DoctorDTO;
import com.healthnest.model.Doctor;
import com.healthnest.service.DoctorService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DoctorControllerTest {

    private DoctorController doctorController;
    private DoctorService doctorService;
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() throws Exception {
        doctorService = mock(DoctorService.class);
        modelMapper = mock(ModelMapper.class);
        doctorController = new DoctorController();

        // Inject mocks via reflection
        Field doctorServiceField = DoctorController.class.getDeclaredField("doctorService");
        doctorServiceField.setAccessible(true);
        doctorServiceField.set(doctorController, doctorService);

        Field modelMapperField = DoctorController.class.getDeclaredField("modelMapper");
        modelMapperField.setAccessible(true);
        modelMapperField.set(doctorController, modelMapper);
    }

    @Test
    void testGetDoctorProfile() {
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. Jane");
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorName("Dr. Jane");

        when(doctorService.getDoctorProfile(1L)).thenReturn(doctor);
        when(modelMapper.map(doctor, DoctorDTO.class)).thenReturn(doctorDTO);

        ResponseEntity<DoctorDTO> response = doctorController.getDoctorProfile(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Dr. Jane", response.getBody().getDoctorName());
    }

    @Test
    void testUpdateDoctorProfile() {
        DoctorDTO doctorDTO = new DoctorDTO();
        when(doctorService.updateDoctorProfile(1L, doctorDTO)).thenReturn("Updated");

        ResponseEntity<String> response = doctorController.updateDoctorProfile(1L, doctorDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated", response.getBody());
    }

    @Test
    void testUpdateDoctorAvailability() {
        when(doctorService.updateDoctorAvailability(1L, "Available")).thenReturn("Availability updated");

        ResponseEntity<String> response = doctorController.updateDoctorAvailability(1L, "Available");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Availability updated", response.getBody());
    }

    @Test
    void testUpdateConsultationFee() {
        when(doctorService.updateConsultationFee(1L, 500.0)).thenReturn("Fee updated");

        ResponseEntity<String> response = doctorController.updateConsultationFee(1L, 500.0);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Fee updated", response.getBody());
    }

    @Test
    void testGetDoctorReviews() {
        when(doctorService.getDoctorRating(1L)).thenReturn(4.5f);

        ResponseEntity<Float> response = doctorController.getDoctorRating(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(4.5f, response.getBody());
    }

    @Test
    void testGetDoctorsBySpecialization() {
        Doctor doctor = new Doctor();
        doctor.setDoctorName("Dr. Smith");
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorName("Dr. Smith");

        when(doctorService.findDoctorsBySpecialization("Cardio")).thenReturn(Arrays.asList(doctor));
        when(modelMapper.map(doctor, DoctorDTO.class)).thenReturn(doctorDTO);

        ResponseEntity<List<DoctorDTO>> response = doctorController.getDoctorsBySpecialization("Cardio");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Smith", response.getBody().get(0).getDoctorName());
    }

    @Test
    void testAddSpecialization() {
        Doctor doctor = new Doctor();
        doctor.setSpecializedrole("Cardio, Neuro");
        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setSpecializedrole("Cardio, Neuro");

        when(doctorService.addSpecialization(1L, "Neuro")).thenReturn(doctor);
        when(modelMapper.map(doctor, DoctorDTO.class)).thenReturn(doctorDTO);

        ResponseEntity<DoctorDTO> response = doctorController.addSpecialization(1L, "Neuro");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Cardio, Neuro", response.getBody().getSpecializedrole());
    }
}
