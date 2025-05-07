package com.healthnest.service;

import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;
import com.healthnest.model.User;
import com.healthnest.model.enums.Gender;
import com.healthnest.repository.FeedBackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FeedBackServiceTest {

    @Mock
    private FeedBackRepository feedBackRepository;

    @InjectMocks
    private FeedBackService feedBackService;

    private FeedBack validFeedback;
    private User user;
    private List<FeedBackDTO> feedbackDTOList;

    @BeforeEach
    void setUp() {
        // Create a valid user
        user = new User();
        user.setUserId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setGender(Gender.MALE);
        user.setPassword("password123");
        user.setDateOfBirth("1990-01-01");
        user.setPhoneNo("1234567890");
        user.setRole("USER");

        // Create a valid feedback
        validFeedback = new FeedBack();
        validFeedback.setId(1L);
        validFeedback.setFeedback("Great service!");
        validFeedback.setEmailId("test@example.com");
        validFeedback.setRating(4.5f);
        validFeedback.setUser(user);

        // Create sample feedback DTOs for repository response
        feedbackDTOList = Arrays.asList(
            new FeedBackDTO(1L, 1L, "Test User", "test@example.com", "Great service!", 4.5f),
            new FeedBackDTO(2L, 2L, "Another User", "another@example.com", "Good experience", 3.5f)
        );
    }

    @Test
    void testAddFeedBack_ValidFeedback() {
        // Arrange
        when(feedBackRepository.save(any(FeedBack.class))).thenReturn(validFeedback);

        // Act
        String result = feedBackService.addFeedBack(validFeedback);

        // Assert
        assertEquals("Success", result);
        verify(feedBackRepository, times(1)).save(validFeedback);
    }

    @Test
    void testAddFeedBack_NullFeedback() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> feedBackService.addFeedBack(null)
        );
        assertEquals("Feedback cannot be null", exception.getMessage());
        verify(feedBackRepository, never()).save(any());
    }

    @Test
    void testAddFeedBack_EmptyFeedbackContent() {
        // Arrange
        FeedBack emptyContentFeedback = new FeedBack();
        emptyContentFeedback.setUser(user);
        emptyContentFeedback.setFeedback("");
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> feedBackService.addFeedBack(emptyContentFeedback)
        );
        assertEquals("Feedback content cannot be empty", exception.getMessage());
        verify(feedBackRepository, never()).save(any());
    }

    @Test
    void testAddFeedBack_NullFeedbackContent() {
        // Arrange
        FeedBack nullContentFeedback = new FeedBack();
        nullContentFeedback.setUser(user);
        nullContentFeedback.setFeedback(null);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> feedBackService.addFeedBack(nullContentFeedback)
        );
        assertEquals("Feedback content cannot be empty", exception.getMessage());
        verify(feedBackRepository, never()).save(any());
    }

    @Test
    void testAddFeedBack_InvalidRating_TooHigh() {
        // Arrange
        FeedBack invalidRatingFeedback = new FeedBack();
        invalidRatingFeedback.setUser(user);
        invalidRatingFeedback.setFeedback("Good service");
        invalidRatingFeedback.setRating(6.0f);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> feedBackService.addFeedBack(invalidRatingFeedback)
        );
        assertEquals("Rating must be between 0 and 5", exception.getMessage());
        verify(feedBackRepository, never()).save(any());
    }

    @Test
    void testAddFeedBack_InvalidRating_Negative() {
        // Arrange
        FeedBack invalidRatingFeedback = new FeedBack();
        invalidRatingFeedback.setUser(user);
        invalidRatingFeedback.setFeedback("Good service");
        invalidRatingFeedback.setRating(-1.0f);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> feedBackService.addFeedBack(invalidRatingFeedback)
        );
        assertEquals("Rating must be between 0 and 5", exception.getMessage());
        verify(feedBackRepository, never()).save(any());
    }

    @Test
    void testAddFeedBack_NullUser() {
        // Arrange
        FeedBack nullUserFeedback = new FeedBack();
        nullUserFeedback.setFeedback("Good service");
        nullUserFeedback.setRating(4.0f);
        nullUserFeedback.setUser(null);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> feedBackService.addFeedBack(nullUserFeedback)
        );
        assertEquals("User cannot be null", exception.getMessage());
        verify(feedBackRepository, never()).save(any());
    }

    @Test
    void testGetAllFeedBack() {
        // Arrange
        when(feedBackRepository.findAllFeedBacksDTO()).thenReturn(feedbackDTOList);

        // Act
        List<FeedBackDTO> result = feedBackService.getAllFeedBack();

        // Assert
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getFeedBackId());
        assertEquals("Test User", result.get(0).getUserName());
        assertEquals("Great service!", result.get(0).getFeedback());
        assertEquals(4.5f, result.get(0).getRating());
        
        verify(feedBackRepository, times(1)).findAllFeedBacksDTO();
    }
}
