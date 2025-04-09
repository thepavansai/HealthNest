package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackDTO {
    private Integer feedBackId;
    private Integer userId;
    private String userName;
    private String userEmail;
    private String feedback;

}
  