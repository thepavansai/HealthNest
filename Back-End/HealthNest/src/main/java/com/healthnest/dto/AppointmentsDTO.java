package com.healthnest.dto;

public class AppointmentsDTO {
    private int appointmentId;
    private Integer userId;
    private Integer doctorId;
    private String appointmentDate;
    private String appointmentTime;
    private String appointmentStatus;

    public AppointmentsDTO() {
    }

    public AppointmentsDTO(String appointmentDate, String appointmentStatus, String appointmentTime, Integer doctorId, Integer userId) {
        this.appointmentDate = appointmentDate;
        this.appointmentStatus = appointmentStatus;
        this.appointmentTime = appointmentTime;
        this.doctorId = doctorId;
        this.userId = userId;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(String appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    @Override
    public String toString() {
        return "AppointmentsDTO{" +
                "appointmentDate='" + appointmentDate + '\'' +
                ", userId=" + userId +
                ", doctorId=" + doctorId +
                ", appointmentTime='" + appointmentTime + '\'' +
                ", appointmentStatus='" + appointmentStatus + '\'' +
                '}';
    }
}
