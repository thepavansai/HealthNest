package com.healthnest.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name="User")
@Entity
public class User {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer userId;
	private String name;
	private String gender;
	private String password;
	private String email;
	private String dateOfBirth;
	private String phoneNo;
	public User() {
		
	}
	public User(int userId, String name, String gender, String password, String email, String dateOfBirth,
			String phoneNo) {
		super();
		this.userId = userId;
		this.name = name;
		this.gender = gender;
		this.password = password;
		this.email = email;
		this.dateOfBirth = dateOfBirth;
		this.phoneNo = phoneNo;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public String getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}
	@Override
	public String toString() {
		return "User [userId=" + userId + ", name=" + name + ", gender=" + gender + ", password=" + password
				+ ", email=" + email + ", dateOfBirth=" + dateOfBirth + ", phoneNo=" + phoneNo + "]";
	}
	
}