package com.healthnest.dto;

import java.util.Date;

public class AppointmentDTO {
	private Long appointmentId;
    private Date date;
    private String time;
    private String status;
    private Long userId;  // Mapping to User
    private Long doctorId;
    
    public AppointmentDTO() {
    	
    }

	public AppointmentDTO(Long appointmentId, Date date, String time, String status, Long userId, Long doctorId) {
		super();
		this.appointmentId = appointmentId;
		this.date = date;
		this.time = time;
		this.status = status;
		this.userId = userId;
		this.doctorId = doctorId;
	}



	public Long getAppointmentId() {
		return appointmentId;
	}

	public void setAppointmentId(Long appointmentId) {
		this.appointmentId = appointmentId;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}

	@Override
	public String toString() {
		return "AppointmentDto [appointmentId=" + appointmentId + ", date=" + date + ", time=" + time + ", status="
				+ status + ", userId=" + userId + ", doctorId=" + doctorId + "]";
	}
    
    

}
