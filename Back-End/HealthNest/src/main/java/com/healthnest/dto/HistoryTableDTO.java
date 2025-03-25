package com.healthnest.dto;

import java.util.Date;

import com.healthnest.model.User;

public class HistoryTableDTO {
	private Long historyId;
    private User user;
    private Long doctorId;
    private Long hospitalId;
    private Long appointmentId;
    private Long symptomId;
    private String diagnosis;
    private Date date;
    public HistoryTableDTO() {}
	public HistoryTableDTO(Long historyId, User user, Long doctorId, Long hospitalId, Long appointmentId,
			Long symptomId, String diagnosis, Date date) {
		super();
		this.historyId = historyId;
		this.user = user;
		this.doctorId = doctorId;
		this.hospitalId = hospitalId;
		this.appointmentId = appointmentId;
		this.symptomId = symptomId;
		this.diagnosis = diagnosis;
		this.date = date;
	}
	public Long getHistoryId() {
		return historyId;
	}
	public void setHistoryId(Long historyId) {
		this.historyId = historyId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Long getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}
	public Long getHospitalId() {
		return hospitalId;
	}
	public void setHospitalId(Long hospitalId) {
		this.hospitalId = hospitalId;
	}
	public Long getAppointmentId() {
		return appointmentId;
	}
	public void setAppointmentId(Long appointmentId) {
		this.appointmentId = appointmentId;
	}
	public Long getSymptomId() {
		return symptomId;
	}
	public void setSymptomId(Long symptomId) {
		this.symptomId = symptomId;
	}
	public String getDiagnosis() {
		return diagnosis;
	}
	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	@Override
	public String toString() {
		return "HistoryTableDto [historyId=" + historyId + ", user=" + user + ", doctorId=" + doctorId + ", hospitalId="
				+ hospitalId + ", appointmentId=" + appointmentId + ", symptomId=" + symptomId + ", diagnosis="
				+ diagnosis + ", date=" + date + "]";
	}
	
    
}
