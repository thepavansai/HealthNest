package com.healthnest.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.service.FeedBackService;

@WebMvcTest(FeedbackController.class)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedBackService feedBackService;

    @Autowired
    private ObjectMapper objectMapper;

    private FeedBack sampleFeedback;
    private FeedBackDTO sampleFeedbackDTO;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setUserId(1);
        user.setName("Test User");

        sampleFeedback = new FeedBack();
        sampleFeedback.setId(1);
        sampleFeedback.setFeedback("Great service!");
        sampleFeedback.setRating(4.5f);
        sampleFeedback.setUser(user);

        sampleFeedbackDTO = new FeedBackDTO(1, 1, "Test User", "test@example.com", "Great service!", 4.5f);
    }

    @Test
    void testAddFeedback_Success() throws Exception {
        when(feedBackService.addFeedBack(any(FeedBack.class))).thenReturn("Success");

        mockMvc.perform(post("/feedback/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleFeedback)))
                .andExpect(status().isOk())
                .andExpect(content().string("Success"));
    }

    @Test
    void testAddFeedback_InvalidRating() throws Exception {
        sampleFeedback.setRating(6.0f);

        mockMvc.perform(post("/feedback/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleFeedback)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetAllFeedback() throws Exception {
        List<FeedBackDTO> feedbacks = Arrays.asList(sampleFeedbackDTO);
        when(feedBackService.getAllFeedBack()).thenReturn(feedbacks);

        mockMvc.perform(get("/feedback/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userName").value("Test User"))
                .andExpect(jsonPath("$[0].feedback").value("Great service!"))
                .andExpect(jsonPath("$[0].rating").value(4.5));
    }
}
