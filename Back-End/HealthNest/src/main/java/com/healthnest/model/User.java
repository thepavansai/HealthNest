package com.healthnest.model;

import com.healthnest.model.enums.Gender;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Table(name="\"user\"")
@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="\"userId\"")
    private Long userId;  // Changed from Integer to Long

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;

    @NotNull(message = "Gender cannot be null")
    private Gender gender;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date should be in YYYY-MM-DD format")
    @Column(name="\"dateOfBirth\"")
    private String dateOfBirth;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    @Column(name="\"phoneNo\"")
    private String phoneNo;
}