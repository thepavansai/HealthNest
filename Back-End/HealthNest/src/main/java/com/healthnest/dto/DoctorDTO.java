package com.healthnest.dto;

public class DoctorDTO {
	private Long doctorId;
    private String doctorName;
    private String specialization;
    private int experience;
    private String docPhnNo;
    private double consultationFee;
    private int rating;
    private boolean availability;
    private Long hospitalId;
    
    
    public DoctorDTO() {
    	
    }
    

	public DoctorDTO(Long doctorId, String doctorName, String specialization, int experience, String docPhnNo,
			double consultationFee, int rating, boolean availability, Long hospitalId) {
		super();
		this.doctorId = doctorId;
		this.doctorName = doctorName;
		this.specialization = specialization;
		this.experience = experience;
		this.docPhnNo = docPhnNo;
		this.consultationFee = consultationFee;
		this.rating = rating;
		this.availability = availability;
		this.hospitalId = hospitalId;
	}


	public Long getDoctorId() {
		return doctorId;
	}


	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}


	public String getDoctorName() {
		return doctorName;
	}


	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}


	public String getSpecialization() {
		return specialization;
	}


	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}


	public int getExperience() {
		return experience;
	}


	public void setExperience(int experience) {
		this.experience = experience;
	}


	public String getDocPhnNo() {
		return docPhnNo;
	}


	public void setDocPhnNo(String docPhnNo) {
		this.docPhnNo = docPhnNo;
	}


	public double getConsultationFee() {
		return consultationFee;
	}


	public void setConsultationFee(double consultationFee) {
		this.consultationFee = consultationFee;
	}


	public int getRating() {
		return rating;
	}


	public void setRating(int rating) {
		this.rating = rating;
	}


	public boolean isAvailability() {
		return availability;
	}


	public void setAvailability(boolean availability) {
		this.availability = availability;
	}


	public Long getHospitalId() {
		return hospitalId;
	}


	public void setHospitalId(Long hospitalId) {
		this.hospitalId = hospitalId;
	}


	@Override
	public String toString() {
		return "DoctorDto [doctorId=" + doctorId + ", doctorName=" + doctorName + ", specialization=" + specialization
				+ ", experience=" + experience + ", docPhnNo=" + docPhnNo + ", consultationFee=" + consultationFee
				+ ", rating=" + rating + ", availability=" + availability + ", hospitalId=" + hospitalId + "]";
	}
    
    
}
