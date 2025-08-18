package com.healthnest.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.config.JwtFilter;
import com.healthnest.config.TestSecurityConfig;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.model.Appointment;
import com.healthnest.model.Doctor;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.model.enums.Gender;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.DoctorService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.JWTService;
import com.healthnest.service.UserService;

@WebMvcTest(UserController.class)
@Import(TestSecurityConfig.class)
@AutoConfigureMockMvc(addFilters = false) // Disable Spring Security filters for testing
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private DoctorService doctorService;

    @MockBean
    private AppointmentService appointmentService;

    @MockBean
    private FeedBackService feedBackService;
    
    @MockBean
    private JWTService jwtService;
    
    @MockBean
    private AuthenticationConfiguration authConfig;
    
    @MockBean
    private AuthenticationManager authenticationManager;
    
    @MockBean
    private JwtFilter jwtFilter;

    private User testUser;
    private UserDTO testUserDTO;
    private Appointment testAppointment;
    private Doctor testDoctor;
    private FeedBack testFeedback;
    private HashMap<String, String> requestBody;
    private String authHeader = "Bearer test-jwt-token";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setPhoneNo("1234567890");
        testUser.setGender(Gender.MALE);
        testUser.setRole("USER");
        
        testUserDTO = new UserDTO();
        testUserDTO.setUserId(1L);
        testUserDTO.setName("Test User");
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setPassword("password123");
        testUserDTO.setPhoneNo("1234567890");
        testUserDTO.setGender(Gender.MALE);
        
        testDoctor = new Doctor();
        testDoctor.setDoctorId(1L);
        testDoctor.setDoctorName("Dr. Test");
        
        testAppointment = new Appointment();
        testAppointment.setAppointmentId(1L);
        testAppointment.setUser(testUser);
        testAppointment.setDoctor(testDoctor);
        
        testFeedback = new FeedBack();
        testFeedback.setId(1L);
        testFeedback.setUser(testUser);
        testFeedback.setFeedback("Great service!");
        testFeedback.setRating(4.5f);
        
        requestBody = new HashMap<>();
        requestBody.put("email", "test@example.com");
        requestBody.put("newPassword", "newPassword123");
        
        
      
        // Setup JWT service mock for authenticated endpoints
        when(jwtService.extractUserEmail(anyString())).thenReturn("test@example.com");
        when(jwtService.extractRole(anyString())).thenReturn("USER");
        when(userService.getUserId("test@example.com")).thenReturn(1L);
        when(userService.getUserName("test@example.com")).thenReturn("Test User");
        
        // Mock the security context to have USER role
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        
        // Create authorities
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        // Use doReturn instead of when for complex generics
        doReturn(authorities).when(authentication).getAuthorities();
        
        SecurityContextHolder.setContext(securityContext);
    }


@AfterEach
void tearDown() {
    // Clear security context after each test
    SecurityContextHolder.clearContext();
}
    @Test
    void testCreateAccount_Success() throws Exception {
        when(userService.isUserAlreadyRegistered(anyString())).thenReturn(false);
        doNothing().when(userService).createUser(any(User.class));
        
        mockMvc.perform(post("/v1/users/Signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    @Test
    void testCreateAccount_UserAlreadyExists() throws Exception {
        when(userService.isUserAlreadyRegistered(anyString())).thenReturn(true);
        
        mockMvc.perform(post("/v1/users/Signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User already registered!"));
    }

    @Test
    void testLogin_Success() throws Exception {
        Map<String, String> loginResult = new HashMap<>();
        loginResult.put("message", "Login successful");
        loginResult.put("token", "test-jwt-token");
        loginResult.put("role", "USER");
        
        when(userService.login(anyString(), anyString())).thenReturn(loginResult);
        when(userService.getUserId(anyString())).thenReturn(1L);
        when(userService.getUserName(anyString())).thenReturn("Test User");
        
        mockMvc.perform(post("/v1/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void testGetUserDetails_Success() throws Exception {
        when(userService.getUserDetails(1L)).thenReturn(testUser);
        
        mockMvc.perform(get("/v1/users/userdetails/1")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }


    @Test
    void testSubmitFeedback_Success() throws Exception {
        // Make sure testFeedback has the correct user ID
        testFeedback.setUser(testUser);
        
        when(feedBackService.addFeedBack(any(FeedBack.class))).thenReturn("Success");
        
        mockMvc.perform(post("/v1/users/feeback")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testFeedback)))
                .andDo(print())
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
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Profile successfully edited"));
    }

    @Test
    void testGetUpcomingAppointments_Success() throws Exception {
        List<AppointmentSummaryDTO> appointments = new ArrayList<>();
        AppointmentSummaryDTO dto = new AppointmentSummaryDTO();
        dto.setAppointmentId(1L);
        appointments.add(dto);
        
        when(appointmentService.getAppointmentSummaries(1L)).thenReturn(appointments);
        
        mockMvc.perform(get("/v1/users/appointments/1")
                .header("Authorization", authHeader))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].appointmentId").value(1));
    }

    @Test
    void testCancelAppointment_Success() throws Exception {
        doNothing().when(userService).cancelAppointment(1L);
        
        mockMvc.perform(patch("/v1/users/cancelappointment/1")
                .header("Authorization", authHeader))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("successfully cancelled Appointment"));
    }

    @Test
    void testChangePassword_Success() throws Exception {
        when(userService.changePassword(eq(1L), eq("oldPass"), eq("newPass"))).thenReturn(true);
        
        mockMvc.perform(patch("/v1/users/changepassword/1/oldPass/newPass")
                .header("Authorization", authHeader))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Password changed successfully"));
    }

    @Test
    void testDeleteAccount_Success() throws Exception {
        doNothing().when(userService).deleteAccount(1L);
        
        mockMvc.perform(delete("/v1/users/deleteuser/1")
                .header("Authorization", authHeader))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted user"));
    }

    @Test
    void testBookAppointment_Success() throws Exception {
        when(userService.bookAppointment(any(Appointment.class))).thenReturn(true);
        
        mockMvc.perform(post("/v1/users/bookappointment")
                .header("Authorization", authHeader)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testAppointment)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Your appointment is successfully booked"));
    }

    @Test
    void testGetAllUsersCount() throws Exception {
        List<User> users = new ArrayList<>();
        users.add(testUser);
        when(userService.getAllUsers()).thenReturn(users);
        
        mockMvc.perform(get("/v1/users/countallusers"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }

    @Test
    void testSetNewPassword() throws Exception {
        when(userService.setNewPassword(eq("test@example.com"), eq("newPassword123"))).thenReturn(true);
        
        mockMvc.perform(post("/v1/users/setnewpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Password has been updated successfully"));
    }

    @Test
    void testCheckEmailExists() throws Exception {
        when(userService.isUserAlreadyRegistered("test@example.com")).thenReturn(true);
        
        mockMvc.perform(post("/v1/users/check-email")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Email exists"));
    }
}
