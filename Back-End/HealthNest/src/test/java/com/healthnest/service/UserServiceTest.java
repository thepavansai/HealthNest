package com.healthnest.service;

import com.healthnest.model.Appointment;
import com.healthnest.model.User;
import com.healthnest.repository.AppointmentRepository;
import com.healthnest.repository.UserRepository;
import com.healthnest.dto.enums.Gender;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleUser = new User();
        sampleUser.setUserId(1);
        sampleUser.setName("John Doe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPassword("password123");
        sampleUser.setPhoneNo("1234567890");
        sampleUser.setGender(Gender.MALE); // Set gender using enum
    }

    @Test
    void testCreateUser_UserAlreadyExists() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        assertThrows(RuntimeException.class, () -> userService.createUser(sampleUser));
    }

    @Test
    void testCreateUser_NewUser() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.empty());
        userService.createUser(sampleUser);
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void testLogin_Success() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        String result = userService.login(sampleUser.getEmail(), "password123");
        assertEquals("Login successful", result);
    }

    @Test
    void testLogin_InvalidPassword() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        String result = userService.login(sampleUser.getEmail(), "wrongPassword");
        assertEquals("Invalid Password", result);
    }

    @Test
    void testLogin_UserNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        String result = userService.login("nonexistent@example.com", "password");
        assertEquals("User doesn't exist", result);
    }

    @Test
    void testEditProfile() {
        User updatedUser = new User();
        updatedUser.setName("Jane Doe");
        updatedUser.setPhoneNo("1111111111");
        updatedUser.setEmail("jane@example.com");
        updatedUser.setGender(Gender.FEMALE); // Set updated gender as enum

        when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        boolean result = userService.editProfile(updatedUser, 1);
        assertTrue(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCancelAppointment() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);
        appointment.setAppointmentStatus("Scheduled");

        when(appointmentRepository.findById(1)).thenReturn(Optional.of(appointment));
        userService.cancelAppointment(1);
        assertEquals("Cancelled", appointment.getAppointmentStatus());
    }

    @Test
    void testChangePassword_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        boolean result = userService.changePassword(1, "password123", "newPassword");
        assertTrue(result);
    }

    @Test
    void testChangePassword_Failure() {
        when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        boolean result = userService.changePassword(1, "wrongPassword", "newPassword");
        assertFalse(result);
    }

    @Test
    void testDeleteAccount() {
        userService.deleteAccount(1);
        verify(userRepository, times(1)).deleteById(1);
    }

    @Test
    void testBookAppointment() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);
        boolean result = userService.bookAppointment(appointment);
        assertTrue(result);
        verify(appointmentRepository, times(1)).save(appointment);
    }

    @Test
    void testGetUserId() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        Integer userId = userService.getUserId(sampleUser.getEmail());
        assertEquals(1, userId);
    }

    @Test
    void testGetUserName() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        String name = userService.getUserName(sampleUser.getEmail());
        assertEquals("John Doe", name);
    }

    @Test
    void testDeleteAllUsers() {
        String response = userService.deleteAllUsers();
        verify(userRepository, times(1)).deleteAll();
        assertEquals("All users deleted", response);
    }

    @Test
    void testGetUserDetails_UserExists() {
        when(userRepository.findById(1)).thenReturn(Optional.of(sampleUser));
        User result = userService.getUserDetails(1);
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
    }

    @Test
    void testGetUserDetails_UserNotFound() {
        when(userRepository.findById(2)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> userService.getUserDetails(2));
        assertEquals("User not found with ID: 2", exception.getMessage());
    }

    @Test
    void testGetAllUsers() {
        List<User> users = Arrays.asList(sampleUser, new User());
        when(userRepository.findAll()).thenReturn(users);
        List<User> result = userService.getAllUsers();
        assertEquals(2, result.size());
    }

    @Test
    void testIsUserAlreadyRegistered_ReturnsTrue() {
        when(userRepository.findByEmail(sampleUser.getEmail())).thenReturn(Optional.of(sampleUser));
        assertTrue(userService.isUserAlreadyRegistered(sampleUser.getEmail()));
    }

    @Test
    void testIsUserAlreadyRegistered_ReturnsFalse() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());
        assertFalse(userService.isUserAlreadyRegistered("notfound@example.com"));
    }
}
