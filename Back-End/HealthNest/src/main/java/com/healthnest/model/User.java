package com.healthnest.model;

import java.util.List;

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
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Appointments> appointments;

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    private List<HistoryTable> history;
}