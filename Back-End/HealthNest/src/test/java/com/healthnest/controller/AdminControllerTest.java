package com.healthnest.controller;

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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    private AdminController adminController;
    private UserService userService;
    private DoctorService doctorService;
    private AppointmentService appointmentService;
    private FeedBackService feedBackService;
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() {
        userService = mock(UserService.class);
        doctorService = mock(DoctorService.class);
        appointmentService = mock(AppointmentService.class);
        feedBackService = mock(FeedBackService.class);
        modelMapper = mock(ModelMapper.class);

        adminController = new AdminController();
        inject(adminController, "userService", userService);
        inject(adminController, "doctorService", doctorService);
        inject(adminController, "appointmentService", appointmentService);
        inject(adminController, "feedBackService", feedBackService);
        inject(adminController, "modelMapper", modelMapper);
    }

    private void inject(Object target, String fieldName, Object toInject) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, toInject);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setUserId(1l);
        user1.setName("John Doe");
        user1.setEmail("john@example.com");

        User user2 = new User();
        user2.setUserId(2l);
        user2.setName("Jane Smith");
        user2.setEmail("jane@example.com");

        List<User> users = Arrays.asList(user1, user2);

        UserDTO dto1 = new UserDTO();
        dto1.setUserId(1l);
        dto1.setName("John Doe");
        dto1.setEmail("john@example.com");

        UserDTO dto2 = new UserDTO();
        dto2.setUserId(2l);
        dto2.setName("Jane Smith");
        dto2.setEmail("jane@example.com");

        when(userService.getAllUsers()).thenReturn(users);
        when(modelMapper.map(user1, UserDTO.class)).thenReturn(dto1);
        when(modelMapper.map(user2, UserDTO.class)).thenReturn(dto2);

        ResponseEntity<List<UserDTO>> response = adminController.getAllUsers();

        assertEquals(2, response.getBody().size());
        assertEquals("John Doe", response.getBody().get(0).getName());
        assertEquals("Jane Smith", response.getBody().get(1).getName());
    }

    @Test
    void testDeleteAllUsers() {
        when(userService.deleteAllUsers()).thenReturn("All users deleted");
        ResponseEntity<String> response = adminController.deleteAllUsers();
        assertEquals("All users deleted", response.getBody());
    }

    @Test
    void testDeleteAllDoctors() {
        when(doctorService.deleteAllDoctors()).thenReturn("All doctors deleted");
        ResponseEntity<String> response = adminController.deleteAllDoctors();
        assertEquals("All doctors deleted", response.getBody());
    }

    @Test
    void testGetAllDoctors() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1l);
        doctor.setDoctorName("Dr. Smith");

        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorId(1l);
        doctorDTO.setDoctorName("Dr. Smith");

        when(doctorService.getAllDoctors()).thenReturn(List.of(doctor));
        when(modelMapper.map(doctor, DoctorDTO.class)).thenReturn(doctorDTO);

        ResponseEntity<List<DoctorDTO>> response = adminController.getAllDoctors();

        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Smith", response.getBody().get(0).getDoctorName());
    }

    @Test
    void testGetAllAppointments() {
        AppointmentShowDTO dto = new AppointmentShowDTO();
        dto.setAppointmentId(1l);
        dto.setDoctorName("Dr. Who");

        when(appointmentService.getAllAppointments()).thenReturn(List.of(dto));

        ResponseEntity<List<AppointmentShowDTO>> response = adminController.getAllAppointments();

        assertEquals(1, response.getBody().size());
        assertEquals("Dr. Who", response.getBody().get(0).getDoctorName());
    }

    @Test
    void testDeleteAppointmentById() {
        when(appointmentService.deleteAppointment(1l)).thenReturn("Appointment deleted");
        ResponseEntity<String> result = adminController.deleteAppointment(1l);
        assertEquals("Appointment deleted", result.getBody());
    }

    @Test
    void testDeleteAllAppointments() {
        when(appointmentService.deleteAllAppointments()).thenReturn("All appointments deleted");
        ResponseEntity<String> result = adminController.deleteAppointment();
        assertEquals("All appointments deleted", result.getBody());
    }

    @Test
    void testGetAllFeedbacks() {
        FeedBackDTO dto = new FeedBackDTO();
        dto.setFeedback("Great service!");

        when(feedBackService.getAllFeedBack()).thenReturn(List.of(dto));
        ResponseEntity<List<FeedBackDTO>> response = adminController.getAllFeedBacks();

        assertEquals(1, response.getBody().size());
        assertEquals("Great service!", response.getBody().get(0).getFeedback());
    }

    @Test
    void testAcceptDoctorSuccess() {
        doNothing().when(doctorService).updateDoctorStatus(1L, 1);
        ResponseEntity<String> response = adminController.acceptDoctor(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Doctor accepted successfully", response.getBody());
    }

    @Test
    void testRejectDoctorSuccess() {
        doNothing().when(doctorService).updateDoctorStatus(1L, -1);
        ResponseEntity<String> response = adminController.rejectDoctor(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Doctor rejected successfully", response.getBody());
    }

    @Test
    void testAcceptDoctorNotFound() {
        doThrow(new RuntimeException()).when(doctorService).updateDoctorStatus(2L, 1);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adminController.acceptDoctor(2L);
        });

        assertNotNull(exception);
    }

    @Test
    void testRejectDoctorNotFound() {
        doThrow(new RuntimeException()).when(doctorService).updateDoctorStatus(3L, -1);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adminController.rejectDoctor(3L);
        });

        assertNotNull(exception);
    }
}
