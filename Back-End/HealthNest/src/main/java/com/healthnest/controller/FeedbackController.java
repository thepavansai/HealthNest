package com.healthnest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.healthnest.model.FeedBack;
import com.healthnest.service.FeedBackService;
import com.healthnest.dto.FeedBackDTO;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedBackService feedBackService;

    @PostMapping("/add")
    public ResponseEntity<String> addFeedback(@RequestBody FeedBack feedback) {
        if (feedback.getRating() != null && (feedback.getRating() < 0 || feedback.getRating() > 5)) {
            throw new IllegalArgumentException("Rating must be between 0 and 5");
        }
        return ResponseEntity.ok(feedBackService.addFeedBack(feedback));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeedBackDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedBackService.getAllFeedBack());
    }
}
