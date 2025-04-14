package com.healthnest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.dto.AppointmentSummaryDTO;
import com.healthnest.dto.UserDTO;
import com.healthnest.model.Appointment;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.service.AppointmentService;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.UserService;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private AppointmentService appointmentService;

    @MockBean
    private FeedBackService feedBackService;

    @MockBean
    private ModelMapper modelMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createAccount_userNotRegistered_returnsSuccess() throws Exception {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail("test@example.com");
        User user = new User();
        user.setEmail("test@example.com");

        when(modelMapper.map(any(UserDTO.class), eq(User.class))).thenReturn(user);
        when(userService.isUserAlreadyRegistered(user.getEmail())).thenReturn(false);

        mockMvc.perform(post("/users/Signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

    @Test
    void login_successful() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("pass");

        when(userService.login(anyString(), anyString())).thenReturn("Login successful");
        when(userService.getUserId(anyString())).thenReturn(1);
        when(userService.getUserName(anyString())).thenReturn("John");

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.userId").value("1"))
                .andExpect(jsonPath("$.name").value("John"));
    }

    @Test
    void getUserDetails_shouldReturnUser() throws Exception {
        User user = new User();
        user.setUserId(1);
        user.setName("Alice");

        when(userService.getUserDetails(1)).thenReturn(user);

        mockMvc.perform(get("/users/userdetails/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice"));
    }

    @Test
    void submitFeedback_shouldReturnSuccessMessage() throws Exception {
        FeedBack feedback = new FeedBack();
        feedback.setFeedback("Great service!");

        when(feedBackService.addFeedBack(any(FeedBack.class))).thenReturn("Success");

        mockMvc.perform(post("/users/feeback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(feedback)))
                .andExpect(status().isOk())
                .andExpect(content().string("Success"));
    }

    @Test
    void editProfile_successful() throws Exception {
        User user = new User();
        when(userService.editProfile(any(User.class), eq(1))).thenReturn(true);

        mockMvc.perform(patch("/users/editprofile/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().string("Profile successfully edited"));
    }

    @Test
    void getUpcomingAppointments_shouldReturnList() throws Exception {
        AppointmentSummaryDTO dto = new AppointmentSummaryDTO(1, 1,"Dr. Smith", 10, "1234567890", 200.0,4.5f, "City Hospital", LocalDate.now(), LocalTime.NOON, "Upcoming", "Consultation");

       
        when(appointmentService.getAppointmentSummaries(1)).thenReturn(List.of(dto));

        
        mockMvc.perform(get("/users/appointments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].doctorName").value("Dr. Smith"));
    }

    @Test
    void cancelAppointment_shouldReturnConfirmation() throws Exception {
        mockMvc.perform(patch("/users/cancelappointment/5"))
                .andExpect(status().isOk())
                .andExpect(content().string("successfully cancelled Appointment"));
    }

    @Test
    void changePassword_successful() throws Exception {
        when(userService.changePassword(1, "oldpass", "newpass")).thenReturn(true);

        mockMvc.perform(patch("/users/changepassword/1/oldpass/newpass"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password changed successfully"));
    }

    @Test
    void deleteAccount_shouldReturnSuccess() throws Exception {
        mockMvc.perform(delete("/users/deleteuser/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted user"));
    }

    @Test
    void bookAppointment_shouldReturnSuccessMessage() throws Exception {
        Appointment appointment = new Appointment();
        when(userService.bookAppointment(any(Appointment.class))).thenReturn(true);

        mockMvc.perform(post("/users/bookappointment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(appointment)))
                .andExpect(status().isOk())
                .andExpect(content().string("Your appointment is successfully booked"));
    }
}
