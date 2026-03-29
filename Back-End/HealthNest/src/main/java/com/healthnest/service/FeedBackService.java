package com.healthnest.service;

import com.healthnest.dto.PublicFeedBackDTO;
import com.healthnest.repository.FeedBackRepository;
import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeedBackService {
    @Autowired 
    private FeedBackRepository feedBackRepository;

    public String addFeedBack(FeedBack feedBack) {
        validateFeedback(feedBack);
        feedBackRepository.save(feedBack);
        return "Success";
    }

    private void validateFeedback(FeedBack feedback) {
        if (feedback == null) {
            throw new IllegalArgumentException("Feedback cannot be null");
        }
        if (feedback.getFeedback() == null || feedback.getFeedback().trim().isEmpty()) {
            throw new IllegalArgumentException("Feedback content cannot be empty");
        }
        if (feedback.getRating() != null && (feedback.getRating() < 0 || feedback.getRating() > 5)) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
        if (feedback.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
    }

    public List<FeedBackDTO> getAllFeedBack() {
        return feedBackRepository.findAllFeedBacksDTO();
    }

    public List<PublicFeedBackDTO> getPublicFeedBack() {
        return feedBackRepository.findAllFeedBacksDTO().stream()
                .map(f -> new PublicFeedBackDTO(
                        f.getUserName(),
                        f.getFeedback(),
                        f.getRating()
                ))
                .collect(Collectors.toList());
    }
}
