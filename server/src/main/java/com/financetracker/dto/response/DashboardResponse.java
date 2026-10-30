package com.financetracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<TransactionResponse> recentTransactions;
    private List<CategorySummaryResponse> expenseByCategory;
    private List<CategorySummaryResponse> incomeByCategory;
    private List<MonthlySummaryResponse> monthlyTrends;
}
