package com.healthnest.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.config.JwtFilter;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;
import com.healthnest.model.enums.Gender;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.JWTService;
import com.healthnest.service.UserService;

@WebMvcTest(controllers = FeedbackController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable Spring Security filters
@TestPropertySource(properties = {
    "spring.security.user.name=test",
    "spring.security.user.password=test"
})
public class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private FeedBackService feedBackService;
    
    @MockBean
    private JWTService jwtService;
    
    @MockBean
    private UserService userService;
    
    // Mock the JwtFilter to avoid UserDetailsService dependency
    @MockBean
    private JwtFilter jwtFilter;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private FeedBack validFeedback;
    private FeedBack invalidRatingFeedback;
    private com.healthnest.model.User testUser;
    private FeedBackDTO feedbackDTO;
    
    private static final String AUTH_HEADER = "Bearer test-token";
    
    @BeforeEach
    void setUp() {
        // Set up test user
        testUser = new com.healthnest.model.User();
        testUser.setUserId(1L);
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setGender(Gender.MALE);
        testUser.setPassword("password123");
        testUser.setDateOfBirth("1990-01-01");
        testUser.setPhoneNo("1234567890");
        testUser.setRole("USER");
        
        // Set up valid feedback
        validFeedback = new FeedBack();
        validFeedback.setId(1L);
        validFeedback.setFeedback("Great service!");
        validFeedback.setEmailId("test@example.com");
        validFeedback.setRating(4.5f);
        validFeedback.setUser(testUser);
        
        // Set up invalid rating feedback
        invalidRatingFeedback = new FeedBack();
        invalidRatingFeedback.setId(2L);
        invalidRatingFeedback.setFeedback("Invalid rating");
        invalidRatingFeedback.setEmailId("test@example.com");
        invalidRatingFeedback.setRating(6.0f);
        invalidRatingFeedback.setUser(testUser);
        
        // Set up feedback DTO
//        feedbackDTO = new FeedBackDTO();
//    //    feedbackDTO.setId(1L);
//        feedbackDTO.setUserId(1L);
//        feedbackDTO.setUserName("Test User");
//        feedbackDTO.setUserEmail("test@example.com");
//        feedbackDTO.setFeedback("Great service!");
//        feedbackDTO.setRating(4.5f);
        
        
     // Set up feedback DTO
        feedbackDTO = new FeedBackDTO();
        feedbackDTO.setFeedBackId(null);  // Changed from setId to setFeedBackId
        feedbackDTO.setUserId(1L);       // Changed from number to string
        feedbackDTO.setUserName("Test User");
        feedbackDTO.setUserEmail("test@example.com");
        feedbackDTO.setFeedback("Great service!");
        feedbackDTO.setRating(4.5f);

        // Configure JWT service mock
        when(jwtService.extractUserEmail(any())).thenReturn("test@example.com");
        
        // Configure user service mock
        when(userService.getUserId(any())).thenReturn(1L);
    }
    
    @Test
    void testAddFeedback_Success() throws Exception {
        when(feedBackService.addFeedBack(any(FeedBack.class))).thenReturn("Success");
        
        mockMvc.perform(post("/v1/feedback/add")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", AUTH_HEADER)
                .content(objectMapper.writeValueAsString(validFeedback)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().string("Success"));
    }
    
    @Test
    void testAddFeedback_InvalidRating() throws Exception {
        when(feedBackService.addFeedBack(any(FeedBack.class)))
            .thenThrow(new IllegalArgumentException("Rating must be between 0 and 5"));
        
        mockMvc.perform(post("/v1/feedback/add")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", AUTH_HEADER)
                .content(objectMapper.writeValueAsString(invalidRatingFeedback)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Rating must be between 0 and 5"));
    }
    
    @Test
    void testAddFeedback_WrongUser() throws Exception {
        // Set up a scenario where the authenticated user is different from the feedback user
        when(userService.getUserId("test@example.com")).thenReturn(2L);
        
        mockMvc.perform(post("/v1/feedback/add")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", AUTH_HEADER)
                .content(objectMapper.writeValueAsString(validFeedback)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isForbidden())
                .andExpect(content().string("You can only submit feedback as yourself"));
    }
    
    @Test
    void testAddFeedback_ServiceException() throws Exception {
        when(feedBackService.addFeedBack(any(FeedBack.class)))
                .thenThrow(new RuntimeException("Service error"));
        
        mockMvc.perform(post("/v1/feedback/add")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", AUTH_HEADER)
                .content(objectMapper.writeValueAsString(validFeedback)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Failed to add feedback: Service error"));
    }
    
    @Test
    void testGetAllFeedback_Success() throws Exception {
        List<FeedBackDTO> feedbacks = Arrays.asList(feedbackDTO);
        when(feedBackService.getAllFeedBack()).thenReturn(feedbacks);
        
        mockMvc.perform(get("/v1/feedback/all"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].feedBackId").value(null))  // Changed from id to feedBackId
                .andExpect(jsonPath("$[0].userId").value("1"))       // Changed from number to string
                .andExpect(jsonPath("$[0].userName").value("Test User"))
                .andExpect(jsonPath("$[0].userEmail").value("test@example.com"))
                .andExpect(jsonPath("$[0].feedback").value("Great service!"))
                .andExpect(jsonPath("$[0].rating").value(4.5));
    }




    
    @Test
    void testGetAllFeedback_ServiceException() throws Exception {
        when(feedBackService.getAllFeedBack()).thenThrow(new RuntimeException("Service error"));
        
        mockMvc.perform(get("/v1/feedback/all"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isInternalServerError());
    }
}
