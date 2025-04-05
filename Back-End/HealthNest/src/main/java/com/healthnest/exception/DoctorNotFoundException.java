package com.healthnest.exception;

public class DoctorNotFoundException extends RuntimeException {
    public DoctorNotFoundException(String message) {
    	super(message);
    }
}
