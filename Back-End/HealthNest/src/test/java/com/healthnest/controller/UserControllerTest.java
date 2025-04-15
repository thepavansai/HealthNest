package com.healthnest.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;
    
    @Mock
    private AppointmentService appointmentService;
    
    @Mock
    private FeedBackService feedBackService;
    
    @Mock
    private ModelMapper modelMapper;
    
    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @InjectMocks
    private UserController userController;

    private User testUser;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");

        testUserDTO = new UserDTO();
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setPassword("password123");
        testUserDTO.setName("Test User");
    }

    @Test
    void createAccount_Success() {
        when(modelMapper.map(testUserDTO, User.class)).thenReturn(testUser);
        when(userService.isUserAlreadyRegistered(anyString())).thenReturn(false);
        doNothing().when(userService).createUser(any(User.class));

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully!", response.getBody());
        verify(userService).createUser(testUser);
    }

    @Test
    void createAccount_UserAlreadyExists() {
        when(modelMapper.map(testUserDTO, User.class)).thenReturn(testUser);
        when(userService.isUserAlreadyRegistered(anyString())).thenReturn(true);

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User already registered!", response.getBody());
        verify(userService, never()).createUser(any(User.class));
    }

    @Test
    void createAccount_EmptyCredentials() {
        testUserDTO.setEmail("");
        testUserDTO.setPassword("");

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody());
    }

    @Test
    void login_Success() {
        User loginUser = new User();
        loginUser.setEmail("test@example.com");
        loginUser.setPassword("password123");

        when(userService.login(anyString(), anyString())).thenReturn("Login successful");
        when(userService.getUserId(anyString())).thenReturn(1);
        when(userService.getUserName(anyString())).thenReturn("Test User");

        ResponseEntity<HashMap<String, String>> response = userController.login(loginUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Login successful", response.getBody().get("message"));
        assertEquals("1", response.getBody().get("userId"));
        assertEquals("Test User", response.getBody().get("name"));
    }

    @Test
    void getUserDetails_Success() {
        when(userService.getUserDetails(1)).thenReturn(testUser);

        ResponseEntity<User> response = userController.getUserDetails(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
    }

    @Test
    void submitFeedback_Success() {
        FeedBack feedback = new FeedBack();
        feedback.setFeedback("Great service!");
        
        when(feedBackService.addFeedBack(any(FeedBack.class))).thenReturn("Success");

        ResponseEntity<String> response = userController.submitFeedback(feedback);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Success", response.getBody());
    }

    @Test
    void submitFeedback_EmptyFeedback() {
        FeedBack feedback = new FeedBack();
        feedback.setFeedback("");

        ResponseEntity<String> response = userController.submitFeedback(feedback);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Feedback cannot be empty", response.getBody());
    }

    @Test
    void editProfile_Success() {
        when(userService.editProfile(any(User.class), anyInt())).thenReturn(true);

        ResponseEntity<String> response = userController.editProfile(testUser, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Profile successfully edited", response.getBody());
    }

    @Test
    void getUpcomingAppointments_Success() {
        List<AppointmentSummaryDTO> appointments = Arrays.asList(
            new AppointmentSummaryDTO()
        );
        
        when(appointmentService.getAppointmentSummaries(1)).thenReturn(appointments);

        ResponseEntity<List<AppointmentSummaryDTO>> response = userController.getUpcomingAppointments(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(appointments, response.getBody());
    }

    @Test
    void cancelAppointment_Success() {
        doNothing().when(userService).cancelAppointment(1);

        ResponseEntity<String> response = userController.cancelAppointment(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("successfully cancelled Appointment", response.getBody());
    }

    @Test
    void changePassword_Success() {
        when(userService.changePassword(1, "oldPass", "newPass")).thenReturn(true);

        ResponseEntity<String> response = userController.changePassword(1, "oldPass", "newPass");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());
    }

    @Test
    void deleteAccount_Success() {
        doNothing().when(userService).deleteAccount(1);

        ResponseEntity<String> response = userController.deleteAccount(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Successfully deleted user", response.getBody());
    }

    @Test
    void bookAppointment_Success() {
        Appointment appointment = new Appointment();
        when(userService.bookAppointment(any(Appointment.class))).thenReturn(true);

        ResponseEntity<String> response = userController.bookAppointment(appointment);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Your appointment is successfully booked", response.getBody());
    }

    @Test
    void getAllUsersCount_Success() {
        List<User> users = Arrays.asList(new User(), new User());
        when(userService.getAllUsers()).thenReturn(users);

        ResponseEntity<Integer> response = userController.getAllUsersCount();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody());
    }

    @Test
    void changePassword_InvalidCurrentPassword() {
        when(userService.changePassword(1, "wrongPass", "newPass")).thenReturn(false);

        ResponseEntity<String> response = userController.changePassword(1, "wrongPass", "newPass");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid current password", response.getBody());
    }

    @Test
    void bookAppointment_Failure() {
        Appointment appointment = new Appointment();
        when(userService.bookAppointment(any(Appointment.class))).thenReturn(false);

        ResponseEntity<String> response = userController.bookAppointment(appointment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Failed to book appointment", response.getBody());
    }

    @Test
    void submitFeedback_ServerError() {
        FeedBack feedback = new FeedBack();
        feedback.setFeedback("Test feedback");
        
        when(feedBackService.addFeedBack(any(FeedBack.class)))
            .thenThrow(new RuntimeException());

        ResponseEntity<String> response = userController.submitFeedback(feedback);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to submit feedback", response.getBody());
    }
}