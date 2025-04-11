package com.healthnest.service;

import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.repository.FeedBackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class FeedBackServiceTest {

    @InjectMocks
    private FeedBackService feedBackService;

    @Mock
    private FeedBackRepository feedBackRepository;

    private FeedBack sampleFeedBack;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock User
        User mockUser = new User();
        mockUser.setUserId(101);
        mockUser.setName("Test User");
        mockUser.setEmail("testuser@example.com");

        // Sample feedback
        sampleFeedBack = new FeedBack();
        sampleFeedBack.setId(1);
        sampleFeedBack.setFeedback("Excellent service!");
        sampleFeedBack.setEmailId("testuser@example.com");
        sampleFeedBack.setUser(mockUser);
    }

    @Test
    void testAddFeedBack() {
        when(feedBackRepository.save(sampleFeedBack)).thenReturn(sampleFeedBack);

        String result = feedBackService.addFeedBack(sampleFeedBack);

        assertEquals("Success", result);
        verify(feedBackRepository, times(1)).save(sampleFeedBack);
    }

    @Test
    void testGetAllFeedBack() {
        FeedBackDTO dto1 = new FeedBackDTO(1, 101, "Alice", "alice@example.com", "Awesome support!", 4.5f);
        FeedBackDTO dto2 = new FeedBackDTO(2, 102, "Bob", "bob@example.com", "Very satisfied", 3.5f);

        List<FeedBackDTO> feedbackList = Arrays.asList(dto1, dto2);

        when(feedBackRepository.findAllFeedBacksDTO()).thenReturn(feedbackList);

        List<FeedBackDTO> result = feedBackService.getAllFeedBack();

        assertNotNull(result);
        assertEquals(2, result.size());

        assertEquals("Alice", result.get(0).getUserName());
        assertEquals("bob@example.com", result.get(1).getUserEmail());
        assertEquals("Awesome support!", result.get(0).getFeedback());
    }
}
