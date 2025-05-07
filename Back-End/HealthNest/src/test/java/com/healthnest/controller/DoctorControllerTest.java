package com.healthnest.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.dto.DoctorDTO;
import com.healthnest.dto.DoctorSummaryDTO;
import com.healthnest.model.Doctor;
import com.healthnest.model.enums.Gender;
import com.healthnest.service.DoctorService;
import com.healthnest.service.JWTService;

// Use a simpler approach without @SpringBootTest
public class DoctorControllerTest {

    private MockMvc mockMvc;
    
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @Mock
    private DoctorService doctorService;
    
    @Mock
    private ModelMapper modelMapper;
    
    @Mock
    private JWTService jwtService;
    
    @InjectMocks
    private DoctorController doctorController;
    
    private HashMap<String, String> requestBody;
    
    private Doctor testDoctor;
    private DoctorDTO testDoctorDTO;
    private String authHeader;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Setup MockMvc with the controller
        mockMvc = MockMvcBuilders.standaloneSetup(doctorController).build();
        
        requestBody = new HashMap<>();
        requestBody.put("email", "doctor@example.com");
        requestBody.put("newPassword", "newPassword123");
        
        // Create test doctor
        testDoctor = new Doctor();
        testDoctor.setDoctorId(1L);
        testDoctor.setDoctorName("Dr. Jane Smith");
        testDoctor.setEmailId("doctor@example.com");
        testDoctor.setGender(Gender.FEMALE);
        testDoctor.setSpecializedrole("Cardiology");
        testDoctor.setExperience(10);
        testDoctor.setConsultationFee(500.0);
        testDoctor.setRating(4.5f);
        testDoctor.setAvailability("Available");
        testDoctor.setHospitalName("City Hospital");
        testDoctor.setStatus(1);
        testDoctor.setAddress("123 Medical Plaza, City");
        testDoctor.setLatitude(40.7128);
        testDoctor.setLongitude(-74.0060);
        
        // Create test doctor DTO
        testDoctorDTO = new DoctorDTO();
        testDoctorDTO.setDoctorName("Dr. Jane Smith");
        testDoctorDTO.setSpecializedrole("Cardiology");
        testDoctorDTO.setRating(4);
        
        // Mock JWT token
        authHeader = "Bearer fake.jwt.token";
    }
    
    // Rest of your test methods remain the same
    // ...

    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testGetDoctorProfile_Forbidden() {
        // Mock JWT service behavior for a different doctor
        when(jwtService.extractUserEmail(anyString())).thenReturn("other.doctor@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("DOCTOR");
        
        // Create a different doctor
        Doctor otherDoctor = new Doctor();
        otherDoctor.setDoctorId(2L);
        otherDoctor.setEmailId("other.doctor@example.com");
        
        when(doctorService.getDoctorIdByEmail("other.doctor@example.com")).thenReturn(otherDoctor);
        
        // Test the controller method directly
        ResponseEntity<DoctorDTO> response = doctorController.getDoctorProfile(1L, authHeader);
        
        // Verify the response is forbidden
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetDoctorProfile_AsAdmin() {
        // Mock JWT service behavior for admin
        when(jwtService.extractUserEmail(anyString())).thenReturn("admin@example.com");
        when(jwtService.extractUserRole(anyString())).thenReturn("ADMIN");
        when(doctorService.getDoctorProfile(1L)).thenReturn(testDoctor);
        when(modelMapper.map(testDoctor, DoctorDTO.class)).thenReturn(testDoctorDTO);
        
        // Test the controller method directly
        ResponseEntity<DoctorDTO> response = doctorController.getDoctorProfile(1L, authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Dr. Jane Smith", response.getBody().getDoctorName());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testUpdateDoctorProfile() {
        // Mock JWT service behavior
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(testDoctor);
        when(doctorService.updateDoctorProfile(eq(1L), any(DoctorDTO.class))).thenReturn("Profile updated successfully");
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.updateDoctorProfile(1L, testDoctorDTO, authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Profile updated successfully", response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testUpdateDoctorProfile_Forbidden() {
        // Mock JWT service behavior for a different doctor
        when(jwtService.extractUserEmail(anyString())).thenReturn("other.doctor@example.com");
        
        // Create a different doctor
        Doctor otherDoctor = new Doctor();
        otherDoctor.setDoctorId(2L);
        otherDoctor.setEmailId("other.doctor@example.com");
        
        when(doctorService.getDoctorIdByEmail("other.doctor@example.com")).thenReturn(otherDoctor);
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.updateDoctorProfile(1L, testDoctorDTO, authHeader);
        
        // Verify the response is forbidden
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("You can only update your own profile", response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testUpdateDoctorAvailability() {
        // Mock JWT service behavior
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(testDoctor);
        when(doctorService.updateDoctorAvailability(1L, "Available")).thenReturn("Availability updated successfully");
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.updateDoctorAvailability(1L, "Available", authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Availability updated successfully", response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testUpdateConsultationFee() {
        // Mock JWT service behavior
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(testDoctor);
        when(doctorService.updateConsultationFee(1L, 500.0)).thenReturn("Fee updated successfully");
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.updateConsultationFee(1L, 500.0, authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Fee updated successfully", response.getBody());
    }
    
    @Test
    void testGetDoctorRating() {
        when(doctorService.getDoctorRating(1L)).thenReturn(4.5f);
        
        // Test the controller method directly
        ResponseEntity<Float> response = doctorController.getDoctorRating(1L);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(4.5f, response.getBody());
    }
    
    @Test
    void testGetAllDoctors() {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        
        when(doctorService.getAllDoctors()).thenReturn(doctors);
        when(modelMapper.map(testDoctor, DoctorDTO.class)).thenReturn(testDoctorDTO);
        
        // Test the controller method directly
        ResponseEntity<List<DoctorDTO>> response = doctorController.getAllDoctors();
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Jane Smith", response.getBody().get(0).getDoctorName());
    }
    
    @Test
    @WithMockUser(roles = "USER")
    void testUpdateDoctorRating() {
        when(doctorService.updateDoctorRating(1L, 4.5f)).thenReturn("Rating updated successfully");
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.updateDoctorRating(1L, 4.5f, authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Rating updated successfully", response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "USER")
    void testUpdateDoctorRating_InvalidRating() {
        // Test the controller method directly with invalid rating
        ResponseEntity<String> response = doctorController.updateDoctorRating(1L, 6.0f, authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Rating must be between 0 and 5", response.getBody());
    }
    @Test
    @WithMockUser(roles = {"USER", "DOCTOR", "ADMIN"})
    void testGetDoctorsBySpecialization() {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        
        when(doctorService.findDoctorsBySpecialization("Cardiology")).thenReturn(doctors);
        when(modelMapper.map(testDoctor, DoctorDTO.class)).thenReturn(testDoctorDTO);
        
        // Test the controller method directly
        ResponseEntity<List<DoctorDTO>> response = doctorController.getDoctorsBySpecialization("Cardiology", authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Jane Smith", response.getBody().get(0).getDoctorName());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testAddSpecialization() {
        // Mock JWT service behavior
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(testDoctor);
        when(doctorService.addSpecialization(1L, "Neurology")).thenReturn(testDoctor);
        when(modelMapper.map(testDoctor, DoctorDTO.class)).thenReturn(testDoctorDTO);
        
        // Test the controller method directly
        ResponseEntity<DoctorDTO> response = doctorController.addSpecialization(1L, "Neurology", authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Dr. Jane Smith", response.getBody().getDoctorName());
    }
    
    @Test
    void testGetAllDoctorsCount() {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        when(doctorService.getAllDoctors()).thenReturn(doctors);
        
        // Test the controller method directly
        ResponseEntity<Integer> response = doctorController.getAllDoctorsCount();
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testChangePassword_Success() {
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(testDoctor);
        when(doctorService.changePassword(1L, "oldPass", "newPass123"))
            .thenReturn("Password changed successfully");
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.changePassword(1L, "oldPass", "newPass123", authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testChangePassword_TooShort() {
        // Mock JWT service behavior
        when(jwtService.extractUserEmail(anyString())).thenReturn("doctor@example.com");
        when(doctorService.getDoctorIdByEmail("doctor@example.com")).thenReturn(testDoctor);
        
        // Test the controller method directly with short password
        ResponseEntity<String> response = doctorController.changePassword(1L, "oldPass", "short", authHeader);
        
        // Verify the response
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("New password must be at least 6 characters long", response.getBody());
    }
    
    @Test
    @WithMockUser(roles = "DOCTOR")
    void testChangePassword_Forbidden() {
        // Mock JWT service behavior for a different doctor
        when(jwtService.extractUserEmail(anyString())).thenReturn("other.doctor@example.com");
        
        // Create a different doctor
        Doctor otherDoctor = new Doctor();
        otherDoctor.setDoctorId(2L);
        otherDoctor.setEmailId("other.doctor@example.com");
        
        when(doctorService.getDoctorIdByEmail("other.doctor@example.com")).thenReturn(otherDoctor);
        
        // Test the controller method directly
        ResponseEntity<String> response = doctorController.changePassword(1L, "oldPass", "newPass123", authHeader);
        
        // Verify the response is forbidden
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("You can only change your own password", response.getBody());
    }
    
    @Test
    void testSetNewPassword_Success() throws Exception {
        // Setup request body
        requestBody.put("email", "doctor@example.com");
        requestBody.put("newPassword", "newPassword123");
        
        when(doctorService.setNewPassword("doctor@example.com", "newPassword123")).thenReturn(true);
        
        // Test via MockMvc
        mockMvc.perform(post("/v1/doctor/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password has been updated successfully"));
    }
    
    @Test
    void testSetNewPassword_PasswordTooShort() throws Exception {
        // Setup request body with short password
        requestBody.put("email", "doctor@example.com");
        requestBody.put("newPassword", "short");
        
        // Test via MockMvc
        mockMvc.perform(post("/v1/doctor/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Password must be at least 6 characters long"));
        
        // Verify service was never called
        verify(doctorService, never()).setNewPassword(anyString(), anyString());
    }
    
    @Test
    void testSetNewPassword_InvalidEmail() throws Exception {
        // Setup request body with invalid email
        requestBody.put("email", "invalid-email");
        requestBody.put("newPassword", "newPassword123");
        
        // Test via MockMvc
        mockMvc.perform(post("/v1/doctor/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email format"));
        
        // Verify service was never called
        verify(doctorService, never()).setNewPassword(anyString(), anyString());
    }
    
    @Test
    void testCheckEmailExists_Success() throws Exception {
        // Setup request body
        requestBody.clear();
        requestBody.put("email", "doctor@example.com");
        
        when(doctorService.isDoctorEmailRegistered("doctor@example.com")).thenReturn(true);
        
        // Test via MockMvc
        mockMvc.perform(post("/v1/doctor/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().string("Email exists"));
    }
    
    @Test
    void testCheckEmailExists_NotFound() throws Exception {
        // Setup request body
        requestBody.clear();
        requestBody.put("email", "nonexistent@example.com");
        
        when(doctorService.isDoctorEmailRegistered("nonexistent@example.com")).thenReturn(false);
        
        // Test via MockMvc
        mockMvc.perform(post("/v1/doctor/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Email not found"));
    }
    
    @Test
    void testCheckEmailExists_InvalidEmail() throws Exception {
        // Setup request body with invalid email
        requestBody.clear();
        requestBody.put("email", "invalid-email");
        
        // Test via MockMvc
        mockMvc.perform(post("/v1/doctor/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email format"));
    }
    
    @Test
    void testGetNearbyDoctors() throws Exception {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        
        when(doctorService.getNearbyDoctors(40.7128, -74.0060, 5.0)).thenReturn(doctors);
        when(modelMapper.map(testDoctor, DoctorDTO.class)).thenReturn(testDoctorDTO);
        
        // Test via MockMvc
        mockMvc.perform(get("/v1/doctor/nearby")
                .param("lat", "40.7128")
                .param("lng", "-74.0060")
                .param("radius", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].doctorName").value("Dr. Jane Smith"));
    }
    
    @Test
    void testGetDoctorsSummary() {
        List<Doctor> doctors = Arrays.asList(testDoctor);
        
        when(doctorService.getAllDoctors()).thenReturn(doctors);
        
        // Test the controller method directly
        ResponseEntity<List<DoctorSummaryDTO>> response = doctorController.getDoctorsSummary();
        
        // Verify the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        // Verify the summary DTO content
        DoctorSummaryDTO summaryDTO = response.getBody().get(0);
        assertEquals("Dr. Jane Smith", summaryDTO.getName());
        assertEquals(4.5f, summaryDTO.getRating());
        assertEquals("City Hospital", summaryDTO.getHospital());
        assertEquals("Available", summaryDTO.getAvailability());
        assertEquals("Cardiology", summaryDTO.getSpecialization());
    }
}

   
