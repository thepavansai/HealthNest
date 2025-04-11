package com.healthnest.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.healthnest.dto.FeedBackDTO;
import com.healthnest.model.FeedBack;

public interface FeedBackRepository extends JpaRepository<FeedBack, Integer> {

    @Query("SELECT new com.healthnest.dto.FeedBackDTO(f.id,u.userId, u.name,u.email, f.feedback,f.rating) " +
           "FROM FeedBack f " +
           "JOIN f.user u " )
    List<FeedBackDTO> findAllFeedBacksDTO();
}