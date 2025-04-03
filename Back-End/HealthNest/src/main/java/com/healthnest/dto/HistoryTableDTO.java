package com.healthnest.dto;

import java.util.Date;

import com.healthnest.model.User;
import lombok.Data;

@Data
public class HistoryTableDTO {
	private Long historyId;
    private User user;
    private Long doctorId;
    private Long hospitalId;
    private Long appointmentId;
    private Long symptomId;
    private String diagnosis;
    private Date date;
}
