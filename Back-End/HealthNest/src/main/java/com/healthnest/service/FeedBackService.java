package com.healthnest.service;

import com.healthnest.repository.FeedBackRepository;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class FeedBackService {
    @Autowired private FeedBackRepository feedBackRepository;

    public String addFeedBack(FeedBack feedBack) {
        feedBackRepository.save(feedBack);
        return "Success";
    }
    public List<FeedBackDTO> getAllFeedBack(){
        return feedBackRepository.findAllFeedBacksDTO();
    }
}
