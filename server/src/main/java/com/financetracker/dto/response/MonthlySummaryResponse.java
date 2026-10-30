package com.financetracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryResponse {
    private int year;
    private int month;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;
    private String monthLabel; // "Jan 2024"

    public MonthlySummaryResponse(int year, int month, BigDecimal income, BigDecimal expense) {
        this.year = year;
        this.month = month;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.balance = this.income.subtract(this.expense);
        this.monthLabel = java.time.Month.of(month).getDisplayName(
                java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH) + " " + year;
    }
}
