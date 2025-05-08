package com.healthnest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.healthnest.model.FeedBack;
import com.healthnest.service.FeedBackService;
import com.healthnest.service.JWTService;
import com.healthnest.service.UserService;
import com.healthnest.dto.FeedBackDTO;
import java.util.List;

@RestController
@CrossOrigin(origins = "https://health-nest.netlify.app")
@RequestMapping("/v1/feedback")
public class FeedbackController {

    @Autowired
    private FeedBackService feedBackService;
    
    @Autowired
    private JWTService jwtService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> addFeedback(
            @RequestBody FeedBack feedback,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract token from Authorization header
            String token = authHeader.substring(7);
            String email = jwtService.extractUserEmail(token);
            
            // Verify that the user is submitting feedback as themselves
            Long authenticatedUser = userService.getUserId(email);
            if (feedback.getUser() != null && authenticatedUser != feedback.getUser().getUserId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only submit feedback as yourself");
            }
            
            if (feedback.getRating() != null && (feedback.getRating() < 0 || feedback.getRating() > 5)) {
                throw new IllegalArgumentException("Rating must be between 0 and 5");
            }
            
            return ResponseEntity.ok(feedBackService.addFeedBack(feedback));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add feedback: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeedBackDTO>> getAllFeedback() {
        try {
            return ResponseEntity.ok(feedBackService.getAllFeedBack());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
