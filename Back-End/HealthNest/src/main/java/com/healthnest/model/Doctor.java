package com.healthnest.model;

import com.healthnest.model.enums.Gender;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "Doctor")
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer doctorId;

    @NotBlank(message = "Doctor name cannot be blank")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String doctorName;

    @NotNull(message = "Gender cannot be null")
    private Gender gender;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String emailId;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Specialization cannot be blank")
    private String specializedrole;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String docPhnNo;

    @Min(value = 0, message = "Consultation fee cannot be negative")
    private Double consultationFee;

    @Min(value = 0, message = "Rating cannot be negative")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Float rating;

    private String availability;
    private String hospitalName;
    private Integer status;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;
}