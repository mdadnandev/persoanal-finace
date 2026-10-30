package com.financetracker.controller;

import com.financetracker.dto.response.ApiResponse;
import com.financetracker.dto.response.DashboardResponse;
import com.financetracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer year) {
        DashboardResponse dashboard = dashboardService.getDashboard(userDetails.getUsername(), year);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}
