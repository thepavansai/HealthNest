package com.healthnest.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class AdminNotFoundExceptionTest {

    @Test
    void constructor_ShouldSetMessage() {
        
        String errorMessage = "Admin with ID 123 not found";
        
        
        AdminNotFoundException exception = new AdminNotFoundException(errorMessage);
        
        
        assertEquals(errorMessage, exception.getMessage());
    }
    
    @Test
    void exceptionShouldInheritFromRuntimeException() {
        
        AdminNotFoundException exception = new AdminNotFoundException("Test message");
        
        
        assertTrue(exception instanceof RuntimeException);
    }
    
    @Test
    void exceptionShouldPreserveStackTrace() {
        
        String errorMessage = "Admin not found";
        
        
        try {
            throw new AdminNotFoundException(errorMessage);
        } catch (AdminNotFoundException ex) {
            assertNotNull(ex.getStackTrace());
            assertEquals(errorMessage, ex.getMessage());
        }
    }
}