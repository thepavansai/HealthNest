package com.healthnest.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        globalExceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void handleDoctorNotFoundException_ShouldReturnNotFoundStatus() {
        
        String errorMessage = "Doctor with ID 123 not found";
        DoctorNotFoundException exception = new DoctorNotFoundException(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleDoctorNotFoundException(exception);

        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleUserNotFoundException_ShouldReturnNotFoundStatus() {
        
        String errorMessage = "User with ID 456 not found";
        UserNotFoundException exception = new UserNotFoundException(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleUserNotFoundException(exception);

        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleAuthenticationException_ShouldReturnUnauthorizedStatus() {
        
        String errorMessage = "Invalid credentials";
        AuthenticationException exception = new AuthenticationException(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleAuthenticationException(exception);

        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleIllegalArgumentException_ShouldReturnBadRequestStatus() {
        
        String errorMessage = "Invalid parameter value";
        IllegalArgumentException exception = new IllegalArgumentException(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleIllegalArgumentException(exception);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleAppointmentNotFoundException_ShouldReturnNotFoundStatus() {
        
        String errorMessage = "Appointment with ID 789 not found";
        AppointmentNotFoundException exception = new AppointmentNotFoundException(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleAppointmentNotFoundException(exception);

        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(errorMessage, response.getBody());
    }

    @Test
    void handleGeneralException_ShouldReturnInternalServerErrorStatus() {
        
        String errorMessage = "Something went wrong";
        Exception exception = new Exception(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleGeneralException(exception);

        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred: " + errorMessage, response.getBody());
    }
    
    @Test
    void handleNullPointerException_ShouldBeHandledByGeneralExceptionHandler() {
        
        String errorMessage = "Null pointer exception occurred";
        NullPointerException exception = new NullPointerException(errorMessage);

        
        ResponseEntity<String> response = globalExceptionHandler.handleGeneralException(exception);

        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred: " + errorMessage, response.getBody());
    }
    
    @Test
    void handleEmptyExceptionMessage_ShouldNotFailForNullMessage() {
        
        Exception exception = new Exception();

        
        ResponseEntity<String> response = globalExceptionHandler.handleGeneralException(exception);

        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred: null", response.getBody());
    }
}