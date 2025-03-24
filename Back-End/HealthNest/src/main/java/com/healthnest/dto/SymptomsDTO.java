package com.healthnest.dto;

import com.healthnest.dto.enums.Gender;

public class SymptomsDTO {
    private String symptomName;
    private String symptomDescription;
    private String location;
    private Gender gender;
    private Integer age;
    private Double duration;
    private Double weight;
    private Double temperature;

    public SymptomsDTO() {
    }

    public SymptomsDTO(Integer age, Double duration, Gender gender, String location, String symptomDescription, String symptomName, Double temperature, Double weight) {
        this.age = age;
        this.duration = duration;
        this.gender = gender;
        this.location = location;
        this.symptomDescription = symptomDescription;
        this.symptomName = symptomName;
        this.temperature = temperature;
        this.weight = weight;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSymptomDescription() {
        return symptomDescription;
    }

    public void setSymptomDescription(String symptomDescription) {
        this.symptomDescription = symptomDescription;
    }

    public String getSymptomName() {
        return symptomName;
    }

    public void setSymptomName(String symptomName) {
        this.symptomName = symptomName;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    @Override
    public String toString() {
        return "SymptomsDTO{" +
                "age=" + age +
                ", symptomName='" + symptomName + '\'' +
                ", symptomDescription='" + symptomDescription + '\'' +
                ", location='" + location + '\'' +
                ", gender=" + gender +
                ", duration=" + duration +
                ", weight=" + weight +
                ", temperature=" + temperature +
                '}';
    }
}
