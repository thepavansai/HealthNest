package com.healthnest.dto;

import com.healthnest.dto.enums.Gender;

import lombok.Data;

@Data
public class DoctorDTO {
	private Integer doctorId;
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
}
