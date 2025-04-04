package com.healthnest.model;

import com.healthnest.model.enums.Gender;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Doctor")
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;
    private String doctorName;
    private Gender gender;
    private String emailId;
    private String password;
    private String specialization;
    private Integer experience;
    private String docPhnNo;
    private Double consultationFee;
    private Integer rating;
    private String availability;
    private String hospitalName;
    private Integer status;

}