package com.healthnest.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentSummaryDTO {
		private Integer appointmentId;
		private Integer doctorId;
	 	private String doctorName;
	    private Integer experience;
	    private String docPhnNo;
	    private Double consultationFee;
	    private Float rating;
	    private String hospitalName;
	    private LocalDate appointmentDate;
	    private LocalTime appointmentTime;
	    private String appointmentStatus;
	    private String description;

}
