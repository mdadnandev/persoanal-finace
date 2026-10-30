package com.financetracker.service;

import com.financetracker.dto.response.*;
import com.financetracker.entity.TransactionType;
import com.financetracker.entity.User;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public DashboardResponse getDashboard(String email, Integer year) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Date range: current year if year provided, else all time
        LocalDate startDate = year != null ? LocalDate.of(year, 1, 1) : null;
        LocalDate endDate = year != null ? LocalDate.of(year, 12, 31) : null;

        // Total income/expense
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndType(
                user.getId(), TransactionType.INCOME, startDate, endDate);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(
                user.getId(), TransactionType.EXPENSE, startDate, endDate);

        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Recent 10 transactions
        List<TransactionResponse> recentTransactions = transactionRepository
                .findRecentByUserId(user.getId(), PageRequest.of(0, 10))
                .stream().map(transactionService::mapToResponse).collect(Collectors.toList());

        // Category breakdowns
        List<CategorySummaryResponse> expenseByCategory = transactionRepository.getCategorySummary(
                user.getId(), TransactionType.EXPENSE, startDate, endDate);
        List<CategorySummaryResponse> incomeByCategory = transactionRepository.getCategorySummary(
                user.getId(), TransactionType.INCOME, startDate, endDate);

        // Monthly trends (last 12 months)
        LocalDate twelveMonthsAgo = LocalDate.now().minusMonths(11).withDayOfMonth(1);
        List<MonthlySummaryResponse> monthlyTrends = transactionRepository.getMonthlySummary(
                user.getId(), twelveMonthsAgo);

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .recentTransactions(recentTransactions)
                .expenseByCategory(expenseByCategory)
                .incomeByCategory(incomeByCategory)
                .monthlyTrends(monthlyTrends)
                .build();
    }
}
