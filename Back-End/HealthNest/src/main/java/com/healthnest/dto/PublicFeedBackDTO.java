package com.healthnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicFeedBackDTO {
    private String userName;
    private String feedback;
    private Float rating;
}
