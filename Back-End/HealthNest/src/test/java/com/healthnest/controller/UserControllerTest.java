package com.healthnest.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.exception.AuthenticationException;
import com.healthnest.exception.UserNotFoundException;
import com.healthnest.model.Appointment;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.model.enums.Gender;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.UserService;




@WebMvcTest(UserController.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

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

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userServiceMockBean;

    @MockBean
    private AppointmentService appointmentServiceMockBean;

    @MockBean
    private FeedBackService feedBackServiceMockBean;

    private User testUser;
    private UserDTO testUserDTO;
    private Appointment testAppointment;
    private FeedBack testFeedback;
    private HashMap<String, String> requestBody;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setUserId(1l);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setPhoneNo("1234567890");
        testUser.setGender(Gender.MALE);

        testUserDTO = new UserDTO();
        testUserDTO.setUserId(1l);
        testUserDTO.setName("Test User");
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setPassword("password123");
        testUserDTO.setPhoneNo("1234567890");
        testUserDTO.setGender(Gender.MALE);

        testAppointment = new Appointment();
        testAppointment.setAppointmentId(1l);
        testAppointment.setUser(testUser);

        testFeedback = new FeedBack();
        testFeedback.setId(1l);
        testFeedback.setUser(testUser);
        testFeedback.setFeedback("Great service!");
        testFeedback.setRating(4.5f);

        requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
        requestBody.put("newPassword", "newPassword123");
    }

    @Test
    void testCreateAccount_Success() {
        when(modelMapper.map(testUserDTO, User.class)).thenReturn(testUser);
        when(userService.isUserAlreadyRegistered(testUserDTO.getEmail())).thenReturn(false);
        doNothing().when(userService).createUser(testUser);

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User registered successfully!", response.getBody());
        verify(userService).createUser(testUser);
    }

    @Test
    void testCreateAccount_NullEmail() {
        testUserDTO.setEmail(null);

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody());
    }

    @Test
    void testCreateAccount_EmptyEmail() {
        testUserDTO.setEmail("");

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody());
    }

    @Test
    void testCreateAccount_NullPassword() {
        testUserDTO.setPassword(null);

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody());
    }

    @Test
    void testCreateAccount_EmptyPassword() {
        testUserDTO.setPassword("");

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody());
    }

    @Test
    void testCreateAccount_InvalidEmail() {
        testUserDTO.setEmail("invalid-email");

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid email or password", response.getBody());
    }

    @Test
    void testCreateAccount_ShortPassword() {
        testUserDTO.setPassword("short");

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid email or password", response.getBody());
    }

    @Test
    void testCreateAccount_UserAlreadyExists() {
        when(modelMapper.map(testUserDTO, User.class)).thenReturn(testUser);
        when(userService.isUserAlreadyRegistered(testUserDTO.getEmail())).thenReturn(true);

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User already registered!", response.getBody());
    }

    @Test
    void testCreateAccount_Exception() {
        when(modelMapper.map(testUserDTO, User.class)).thenReturn(testUser);
        when(userService.isUserAlreadyRegistered(testUserDTO.getEmail())).thenReturn(false);
        doThrow(new IllegalArgumentException("Test exception")).when(userService).createUser(testUser);

        ResponseEntity<String> response = userController.createAccount(testUserDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Test exception", response.getBody());
    }

    @Test
    void testLogin_Success() {
        when(userService.login(testUser.getEmail(), testUser.getPassword())).thenReturn("Login successful");
        when(userService.getUserId(testUser.getEmail())).thenReturn(1l);
        when(userService.getUserName(testUser.getEmail())).thenReturn("Test User");

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        HashMap<String, String> responseBody = response.getBody();
        assertEquals("Login successful", responseBody.get("message"));
        assertEquals("1", responseBody.get("userId"));
        assertEquals("Test User", responseBody.get("name"));
    }

    @Test
    void testLogin_NullEmail() {
        testUser.setEmail(null);

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody().get("message"));
    }

    @Test
    void testLogin_EmptyEmail() {
        testUser.setEmail("");

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody().get("message"));
    }

    @Test
    void testLogin_NullPassword() {
        testUser.setPassword(null);

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody().get("message"));
    }

    @Test
    void testLogin_EmptyPassword() {
        testUser.setPassword("");

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email and password cannot be empty", response.getBody().get("message"));
    }

    @Test
    void testLogin_AuthenticationException() {
        when(userService.login(testUser.getEmail(), testUser.getPassword()))
                .thenThrow(new AuthenticationException("Invalid credentials"));

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody().get("message"));
    }

    @Test
    void testLogin_UserNotFoundException() {
        when(userService.login(testUser.getEmail(), testUser.getPassword()))
                .thenThrow(new UserNotFoundException("User not found"));

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody().get("message"));
    }

    @Test
    void testLogin_GeneralException() {
        when(userService.login(testUser.getEmail(), testUser.getPassword()))
                .thenThrow(new RuntimeException("Unexpected error"));

        ResponseEntity<HashMap<String, String>> response = userController.login(testUser);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred during login", response.getBody().get("message"));
    }

    @Test
    void testGetUserDetails_Success() {
        when(userService.getUserDetails(1l)).thenReturn(testUser);

        ResponseEntity<User> response = userController.getUserDetails(1l);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
    }

    @Test
    void testGetUserDetails_UserNotFound() {
        when(userService.getUserDetails(999l)).thenThrow(new UserNotFoundException("User not found"));

        assertThrows(UserNotFoundException.class, () -> userController.getUserDetails(999l));
    }

    @Test
    void testSubmitFeedback_Success() {
        when(feedBackService.addFeedBack(testFeedback)).thenReturn("Success");

        ResponseEntity<String> response = userController.submitFeedback(testFeedback);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Success", response.getBody());
    }

    @Test
    void testSubmitFeedback_NullFeedback() {
        ResponseEntity<String> response = userController.submitFeedback(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Feedback cannot be empty", response.getBody());
    }

    @Test
    void testSubmitFeedback_EmptyFeedbackContent() {
        testFeedback.setFeedback("");

        ResponseEntity<String> response = userController.submitFeedback(testFeedback);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Feedback cannot be empty", response.getBody());
    }

    @Test
    void testSubmitFeedback_NullFeedbackContent() {
        testFeedback.setFeedback(null);

        ResponseEntity<String> response = userController.submitFeedback(testFeedback);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Feedback cannot be empty", response.getBody());
    }

    @Test
    void testSubmitFeedback_IllegalArgumentException() {
        when(feedBackService.addFeedBack(testFeedback)).thenThrow(new IllegalArgumentException("Invalid feedback"));

        ResponseEntity<String> response = userController.submitFeedback(testFeedback);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid feedback", response.getBody());
    }

    @Test
    void testSubmitFeedback_GeneralException() {
        when(feedBackService.addFeedBack(testFeedback)).thenThrow(new RuntimeException("Unexpected error"));

        ResponseEntity<String> response = userController.submitFeedback(testFeedback);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to submit feedback", response.getBody());
    }

    @Test
    void testEditProfile_Success() {
        when(userService.editProfile(testUser, 1l)).thenReturn(true);

        ResponseEntity<String> response = userController.editProfile(testUser, 1l);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Profile successfully edited", response.getBody());
    }

    @Test
    void testEditProfile_Failed() {
        when(userService.editProfile(testUser, 1l)).thenReturn(false);

        ResponseEntity<String> response = userController.editProfile(testUser, 1l);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Failed to edit profile", response.getBody());
    }

    @Test
    void testEditProfile_NullUser() {
        ResponseEntity<String> response = userController.editProfile(null, 1l);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid input", response.getBody());
    }

    @Test
    void testEditProfile_NullName() {
        testUser.setName(null);

        ResponseEntity<String> response = userController.editProfile(testUser, 1l);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid input", response.getBody());
    }

    @Test
    void testEditProfile_EmptyName() {
        testUser.setName("");

        ResponseEntity<String> response = userController.editProfile(testUser, 1l);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid input", response.getBody());
    }

    @Test
    void testEditProfile_Exception() {
        when(userService.editProfile(testUser, 1l)).thenThrow(new RuntimeException("Test exception"));

        ResponseEntity<String> response = userController.editProfile(testUser, 1l);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred", response.getBody());
    }

    @Test
    void testGetUpcomingAppointments_Success() {
        List<AppointmentSummaryDTO> appointments = new ArrayList<>();
        AppointmentSummaryDTO dto = new AppointmentSummaryDTO();
        dto.setAppointmentId(1l);
        appointments.add(dto);

        when(appointmentService.getAppointmentSummaries(1l)).thenReturn(appointments);

        ResponseEntity<List<AppointmentSummaryDTO>> response = userController.getUpcomingAppointments(1l);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(appointments, response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetUpcomingAppointments_EmptyList() {
        List<AppointmentSummaryDTO> appointments = new ArrayList<>();
        when(appointmentService.getAppointmentSummaries(1l)).thenReturn(appointments);

        ResponseEntity<List<AppointmentSummaryDTO>> response = userController.getUpcomingAppointments(1l);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody().size());
    }

    @Test
    void testGetUpcomingAppointments_Exception() {
        when(appointmentService.getAppointmentSummaries(1l)).thenThrow(new RuntimeException("Test exception"));

        assertThrows(RuntimeException.class, () -> userController.getUpcomingAppointments(1l));
    }

    @Test
    void testCancelAppointment_Success() {
        doNothing().when(userService).cancelAppointment(1l);

        ResponseEntity<String> response = userController.cancelAppointment(1l);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("successfully cancelled Appointment", response.getBody());
    }

    @Test
    void testCancelAppointment_NotFound() {
        doThrow(new NoSuchElementException("Not found")).when(userService).cancelAppointment(999l);

        ResponseEntity<String> response = userController.cancelAppointment(999l);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Appointment not found", response.getBody());
    }

    @Test
    void testCancelAppointment_Exception() {
        doThrow(new RuntimeException("Test exception")).when(userService).cancelAppointment(1l);

        ResponseEntity<String> response = userController.cancelAppointment(1l);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to cancel appointment", response.getBody());
    }

    @Test
    void testChangePassword_Success() {
        when(userService.changePassword(1l, "oldPass", "newPass")).thenReturn(true);

        ResponseEntity<String> response = userController.changePassword(1l, "oldPass", "newPass");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());
    }

    @Test
    void testChangePassword_Failed() {
        when(userService.changePassword(1l, "wrongPass", "newPass")).thenReturn(false);

        ResponseEntity<String> response = userController.changePassword(1l, "wrongPass", "newPass");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid current password", response.getBody());
    }

    @Test
    void testChangePassword_UserNotFound() {
        when(userService.changePassword(999l, "oldPass", "newPass"))
                .thenThrow(new UserNotFoundException("User not found"));

        ResponseEntity<String> response = userController.changePassword(999l, "oldPass", "newPass");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testChangePassword_IllegalArgument() {
        when(userService.changePassword(1l, "oldPass", "short"))
                .thenThrow(new IllegalArgumentException("Password too short"));

        ResponseEntity<String> response = userController.changePassword(1l, "oldPass", "short");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password too short", response.getBody());
    }

    @Test
    void testChangePassword_Exception() {
        when(userService.changePassword(1l, "oldPass", "newPass"))
                .thenThrow(new RuntimeException("Test exception"));

        ResponseEntity<String> response = userController.changePassword(1l, "oldPass", "newPass");

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to change password", response.getBody());
    }

    @Test
    void testDeleteAccount_Success() {
        doNothing().when(userService).deleteAccount(1l);

        ResponseEntity<String> response = userController.deleteAccount(1l);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Successfully deleted user", response.getBody());
    }

    @Test
    void testDeleteAccount_UserNotFound() {
        doThrow(new UserNotFoundException("User not found")).when(userService).deleteAccount(999l);

        ResponseEntity<String> response = userController.deleteAccount(999l);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testDeleteAccount_Exception() {
        doThrow(new RuntimeException("Test exception")).when(userService).deleteAccount(1l);

        ResponseEntity<String> response = userController.deleteAccount(1l);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to delete user", response.getBody());
    }

    @Test
    void testBookAppointment_Success() {
        when(userService.bookAppointment(testAppointment)).thenReturn(true);

        ResponseEntity<String> response = userController.bookAppointment(testAppointment);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Your appointment is successfully booked", response.getBody());
    }

    @Test
    void testBookAppointment_Failed() {
        when(userService.bookAppointment(testAppointment)).thenReturn(false);

        ResponseEntity<String> response = userController.bookAppointment(testAppointment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Failed to book appointment", response.getBody());
    }

    @Test
    void testBookAppointment_NullAppointment() {
        ResponseEntity<String> response = userController.bookAppointment(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Appointment cannot be null", response.getBody());
    }

    @Test
    void testBookAppointment_Exception() {
        when(userService.bookAppointment(testAppointment)).thenThrow(new RuntimeException("Test exception"));

        ResponseEntity<String> response = userController.bookAppointment(testAppointment);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to book appointment", response.getBody());
    }

    @Test
    void testGetAllUsersCount_Success() {
        List<User> users = new ArrayList<>();
        users.add(testUser);
        users.add(new User());
        when(userService.getAllUsers()).thenReturn(users);

        ResponseEntity<Integer> response = userController.getAllUsersCount();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody());
    }

    @Test
    void testGetAllUsersCount_EmptyList() {
        List<User> users = new ArrayList<>();
        when(userService.getAllUsers()).thenReturn(users);

        ResponseEntity<Integer> response = userController.getAllUsersCount();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, response.getBody());
    }

    @Test
    void testGetAllUsersCount_Exception() {
        when(userService.getAllUsers()).thenThrow(new RuntimeException("Test exception"));

        assertThrows(RuntimeException.class, () -> userController.getAllUsersCount());
    }

    @Test
    void testSetNewPassword_Success() throws Exception {
        when(userServiceMockBean.setNewPassword("test@example.com", "newPassword123")).thenReturn(true);

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password has been updated successfully"));

        verify(userServiceMockBean).setNewPassword("test@example.com", "newPassword123");
    }

    @Test
    void testSetNewPassword_UserNotFound() throws Exception {
        when(userServiceMockBean.setNewPassword("test@example.com", "newPassword123"))
                .thenThrow(new UserNotFoundException("User not found with email: test@example.com"));

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found with email: test@example.com"));

        verify(userServiceMockBean).setNewPassword("test@example.com", "newPassword123");
    }

    @Test
    void testSetNewPassword_InvalidEmail() throws Exception {
        requestBody.put("email", "invalid-email");

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email format"));

        verify(userServiceMockBean, never()).setNewPassword(anyString(), anyString());
    }

    @Test
    void testSetNewPassword_EmptyEmail() throws Exception {
        requestBody.put("email", "");

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email format"));

        verify(userServiceMockBean, never()).setNewPassword(anyString(), anyString());
    }

    @Test
    void testSetNewPassword_PasswordTooShort() throws Exception {
        requestBody.put("newPassword", "short");

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Password must be at least 6 characters long"));

        verify(userServiceMockBean, never()).setNewPassword(anyString(), anyString());
    }

    @Test
    void testSetNewPassword_EmptyPassword() throws Exception {
        requestBody.put("newPassword", "");

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Password must be at least 6 characters long"));

        verify(userServiceMockBean, never()).setNewPassword(anyString(), anyString());
    }

    @Test
    void testSetNewPassword_ServerError() throws Exception {
        when(userServiceMockBean.setNewPassword("test@example.com", "newPassword123"))
                .thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(post("/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Failed to set new password: Database error"));

        verify(userServiceMockBean).setNewPassword("test@example.com", "newPassword123");
    }
}