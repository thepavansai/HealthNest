package com.healthnest.model;

import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Doctor")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long DoctorId;

    private String DoctorName;
    private String Specialization;
    private int Experience;
    private String DocPhnNo;
    private double ConsultationFee;
    private int Rating;
    private boolean Availability;

    @ManyToOne
    @JoinColumn(name = "HospitalId", nullable = false)
    private Hospital hospital;
    
    public Doctor() {
    	
    }
    
	public Doctor(Long doctorId, String doctorName, String specialization, int experience, String docPhnNo,
			double consultationFee, int rating, boolean availability, Hospital hospital) {
		super();
		DoctorId = doctorId;
		DoctorName = doctorName;
		Specialization = specialization;
		Experience = experience;
		DocPhnNo = docPhnNo;
		ConsultationFee = consultationFee;
		Rating = rating;
		Availability = availability;
		this.hospital = hospital;
	}

	public Long getDoctorId() {
		return DoctorId;
	}

	public void setDoctorId(Long doctorId) {
		DoctorId = doctorId;
	}

	public String getDoctorName() {
		return DoctorName;
	}

	public void setDoctorName(String doctorName) {
		DoctorName = doctorName;
	}

	public String getSpecialization() {
		return Specialization;
	}

	public void setSpecialization(String specialization) {
		Specialization = specialization;
	}

	public int getExperience() {
		return Experience;
	}

	public void setExperience(int experience) {
		Experience = experience;
	}

	public String getDocPhnNo() {
		return DocPhnNo;
	}

	public void setDocPhnNo(String docPhnNo) {
		DocPhnNo = docPhnNo;
	}

	public double getConsultationFee() {
		return ConsultationFee;
	}

	public void setConsultationFee(double consultationFee) {
		ConsultationFee = consultationFee;
	}

	public int getRating() {
		return Rating;
	}

	public void setRating(int rating) {
		Rating = rating;
	}

	public boolean isAvailability() {
		return Availability;
	}

	public void setAvailability(boolean availability) {
		Availability = availability;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	@Override
	public String toString() {
		return "Doctor [DoctorId=" + DoctorId + ", DoctorName=" + DoctorName + ", Specialization=" + Specialization
				+ ", Experience=" + Experience + ", DocPhnNo=" + DocPhnNo + ", ConsultationFee=" + ConsultationFee
				+ ", Rating=" + Rating + ", Availability=" + Availability + ", hospital=" + hospital + "]";
	}
    
    
    
}