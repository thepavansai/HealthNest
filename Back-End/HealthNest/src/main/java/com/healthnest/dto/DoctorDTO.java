package com.healthnest.dto;

import com.healthnest.model.enums.Gender;

import lombok.Data;

@Data
public class DoctorDTO {
    private Long doctorId;  // Changed from Integer to Long
    private String doctorName;
    private Gender gender;
    private String emailId;
    private String password;
    private String specializedrole;
    private Integer experience;
    private String docPhnNo;
    private Double consultationFee;
    private Integer rating;
    private String availability;
    private String HospitalName;
    private Integer status;

    // New fields for location
    private String address; // Full address of the doctor
    private Double latitude; // Latitude of the doctor's location
    private Double longitude; // Longitude of the doctor's location
}
