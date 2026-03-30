package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackDTO {
    private Long feedBackId;  // Changed from Integer to Long
    private Long userId;     // Changed from Integer to Long
    private String userName;
    private String userEmail;
    private String feedback;
    private Float rating;

}
