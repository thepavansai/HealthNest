package com.healthnest.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity(name="Appointments")
public class Appointments {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer appointmentId;
    @NotNull
    private Integer userId;
    @NotNull
    private Integer doctorId;
    @NotNull
    private String appointmentDate;
    @NotNull
    private String appointmentTime;
    @NotNull
    private String appointmentStatus;

    public Appointments() {
    }

    public Appointments(String appointmentDate, String appointmentStatus, String appointmentTime, Integer doctorId, Integer userId) {
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

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
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

    @Override
    public String toString() {
        return "Appointment{" +
                "appointmentDate='" + appointmentDate + '\'' +
                ", appointmentId=" + appointmentId +
                ", userId=" + userId +
                ", doctorId=" + doctorId +
                ", appointmentTime='" + appointmentTime + '\'' +
                ", appointmentStatus='" + appointmentStatus + '\'' +
                '}';
    }
}
