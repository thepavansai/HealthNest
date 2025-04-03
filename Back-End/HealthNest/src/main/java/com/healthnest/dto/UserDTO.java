package com.healthnest.dto;

import lombok.Data;

@Data
public class UserDTO {
	private int userId;
	private String name;
	private String gender;
	private String password;
	private String email;
	private String dateOfBirth;
	private String phoneNo;
}
