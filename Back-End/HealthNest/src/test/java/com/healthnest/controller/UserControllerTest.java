package com.healthnest.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.config.JwtFilter;
import com.healthnest.config.TestSecurityConfig;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.model.*;
import com.healthnest.service.*;

@WebMvcTest(UserController.class)
@Import(TestSecurityConfig.class)
@AutoConfigureMockMvc(addFilters = false) // Bypass security filters for unit testing
class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private UserService userService;
    @MockBean private DoctorService doctorService;
    @MockBean private AppointmentService appointmentService;
    @MockBean private FeedBackService feedBackService;
    @MockBean private JWTService jwtService;
    @MockBean private AppointmentLockService lockService;
    @MockBean(name = "bookingThreadPool") private Executor bookingExecutor;
    
    // Security Mocks
    @MockBean private AuthenticationConfiguration authConfig;
    @MockBean private AuthenticationManager authenticationManager;
    @MockBean private JwtFilter jwtFilter;

    private User testUser;
    private UserDTO testUserDTO;
    private Appointment testAppointment;
    private Doctor testDoctor;
    private FeedBack testFeedback;
    private String authHeader = "Bearer test-jwt-token";

    @BeforeEach
    void setUp() {
        // Initialize Test Data
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setName("Gowtham");
        testUser.setEmail("gowtham@example.com");
        testUser.setPassword("password123");

        testUserDTO = new UserDTO();
        testUserDTO.setUserId(1L);
        testUserDTO.setName("Gowtham");
        testUserDTO.setEmail("gowtham@example.com");
        testUserDTO.setPassword("password123");

        testDoctor = new Doctor();
        testDoctor.setDoctorId(101L);
        testDoctor.setDoctorName("Dr. Smith");

        testAppointment = new Appointment();
        testAppointment.setAppointmentId(500L);
        testAppointment.setUser(testUser);
        testAppointment.setDoctor(testDoctor);
        testAppointment.setAppointmentDate(LocalDate.now().plusDays(1));
        testAppointment.setAppointmentTime(LocalTime.of(10, 30));

        testFeedback = new FeedBack();
        testFeedback.setUser(testUser);
        testFeedback.setFeedback("Excellent service");

        // Global Mocks for Authenticated Requests
        when(jwtService.extractUserEmail(anyString())).thenReturn("gowtham@example.com");
        when(userService.getUserId("gowtham@example.com")).thenReturn(1L);

        // Mock Async Executor to run task immediately in the same thread
        doAnswer(invocation -> {
            ((Runnable) invocation.getArgument(0)).run();
            return null;
        }).when(bookingExecutor).execute(any(Runnable.class));

        // Mock Security Context
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_USER"))).when(authentication).getAuthorities();
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // --- Public Endpoints ---

    @Test
    void testCreateAccount_Success() throws Exception {
        when(userService.isUserAlreadyRegistered(anyString())).thenReturn(false);
        doNothing().when(userService).createUser(any(User.class));

        mockMvc.perform(post("/v1/users/Signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    @Test
    void testLogin_Success() throws Exception {
        // 1. Arrange - Use anyString() to be safe against minor data mismatches
        Map<String, String> loginResult = new HashMap<>();
        loginResult.put("message", "Login successful");
        loginResult.put("token", "fake-token");
        
        // Stub the login call
        when(userService.login(anyString(), anyString())).thenReturn(loginResult);
        
        // Stub the ID and Name calls using anyString()
        when(userService.getUserId(anyString())).thenReturn(1L);
        when(userService.getUserName(anyString())).thenReturn("Gowtham");

        // 2. Act
        mockMvc.perform(post("/v1/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser))) // Ensure testUser has email/password set
                .andDo(print()) 
                .andExpect(status().isOk())
                // 3. Assert
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").value("fake-token"))
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.name").value("Gowtham"));
    }

    // --- Authenticated User Endpoints ---

    @Test
    void testBookAppointment_Success() throws Exception {
        // Mocking the Guava Lock
        Lock mockLock = mock(Lock.class);
        when(lockService.getLockForSlot(anyLong(), any(), any())).thenReturn(mockLock);
        when(mockLock.tryLock(anyLong(), any(TimeUnit.class))).thenReturn(true);
        when(userService.bookAppointment(any(Appointment.class))).thenReturn(true);

        // Perform Async Request
        MvcResult mvcResult = mockMvc.perform(post("/v1/users/bookappointment")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testAppointment)))
                .andExpect(request().asyncStarted())
                .andReturn();

        // Verify Final Result after Async Dispatch
        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk())
                .andExpect(content().string("Our appointment is successfully booked"));
    }

    @Test
    void testGetUserDetails_Success() throws Exception {
        when(userService.getUserDetails(1L)).thenReturn(testUser);

        mockMvc.perform(get("/v1/users/userdetails/1")
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Gowtham"));
    }

    @Test
    void testSubmitFeedback_Success() throws Exception {
        when(feedBackService.addFeedBack(any(FeedBack.class))).thenReturn("Success");

        mockMvc.perform(post("/v1/users/feeback")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testFeedback)))
                .andExpect(status().isOk())
                .andExpect(content().string("Success"));
    }

    @Test
    void testEditProfile_Success() throws Exception {
        when(userService.editProfile(any(User.class), eq(1L))).thenReturn(true);

        mockMvc.perform(patch("/v1/users/editprofile/1")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isOk())
                .andExpect(content().string("Profile successfully edited"));
    }

    @Test
    void testGetUpcomingAppointments_Success() throws Exception {
        AppointmentSummaryDTO dto = new AppointmentSummaryDTO();
        dto.setAppointmentId(500L);
        when(appointmentService.getAppointmentSummaries(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/v1/users/appointments/1")
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].appointmentId").value(500));
    }

    @Test
    void testCancelAppointment_Success() throws Exception {
        doNothing().when(userService).cancelAppointment(500L);

        mockMvc.perform(patch("/v1/users/cancelappointment/500")
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(content().string("successfully cancelled Appointment"));
    }

    @Test
    void testDeleteAccount_Success() throws Exception {
        doNothing().when(userService).deleteAccount(1L);

        mockMvc.perform(delete("/v1/users/deleteuser/1")
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted user"));
    }

    @Test
    void testChangePassword_Success() throws Exception {
        when(userService.changePassword(eq(1L), anyString(), anyString())).thenReturn(true);

        mockMvc.perform(patch("/v1/users/changepassword/1/oldPass/newPass")
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(content().string("Password changed successfully"));
    }
}