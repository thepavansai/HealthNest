package com.healthnest.model;

import com.healthnest.dto.enums.Gender;

import jakarta.persistence.*;
import lombok.Data;

@Table(name="User")
@Entity
@Data


public class User {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer userId;
	private String name;
	private Gender gender;
	private String password;
	private String email;
	private String dateOfBirth;
	private String phoneNo;
}