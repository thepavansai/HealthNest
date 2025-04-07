package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentSummaryDTO {
	 	private String doctorName;
	    private Integer experience;
	    private String docPhnNo;
	    private Double consultationFee;
	    private Float rating;
	    private String hospitalName;
	    private String appointmentDate;
	    private String appointmentTime;
	    private String appointmentStatus;
	    private String description;

}
