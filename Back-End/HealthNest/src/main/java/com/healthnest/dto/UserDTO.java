package com.healthnest.dto;

import com.healthnest.model.enums.Gender;

import lombok.Data;

@Data
public class UserDTO {
    private Long userId;  // Changed from Integer to Long
    private String name;
    private Gender gender;
    private String password;
    private String email;
    private String dateOfBirth;
    private String phoneNo;
	private String role;
}
