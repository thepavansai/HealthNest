package com.healthnest.dto;

import lombok.Data;

@Data
public class DoctorDTO {
	private Long doctorId;
    private String doctorName;
    private String specialization;
    private Integer experience;
    private String docPhnNo;
    private Double consultationFee;
    private Integer rating;
    private String availability;
    private String HospitalName;
}
