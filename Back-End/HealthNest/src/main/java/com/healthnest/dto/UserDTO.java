package com.healthnest.dto;

import com.healthnest.dto.enums.Gender;

import lombok.Data;

@Data
public class UserDTO {
	private Integer userId;
	private String name;
	private Gender gender;
	private String password;
	private String email;
	private String dateOfBirth;
	private String phoneNo;
}
