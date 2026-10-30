package com.financetracker.repository;

import com.financetracker.dto.response.CategorySummaryResponse;
import com.financetracker.dto.response.MonthlySummaryResponse;
import com.financetracker.entity.Transaction;
import com.financetracker.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.user.id = :userId
            AND (:type IS NULL OR t.type = :type)
            AND (:categoryId IS NULL OR t.category.id = :categoryId)
            AND (:startDate IS NULL OR t.date >= :startDate)
            AND (:endDate IS NULL OR t.date <= :endDate)
            ORDER BY t.date DESC, t.createdAt DESC
            """)
    Page<Transaction> findAllByFilters(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user.id = :userId AND t.type = :type
            AND (:startDate IS NULL OR t.date >= :startDate)
            AND (:endDate IS NULL OR t.date <= :endDate)
            """)
    BigDecimal sumByUserIdAndType(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT new com.financetracker.dto.response.CategorySummaryResponse(
                c.name, c.icon, c.color, SUM(t.amount)
            )
            FROM Transaction t
            JOIN t.category c
            WHERE t.user.id = :userId AND t.type = :type
            AND (:startDate IS NULL OR t.date >= :startDate)
            AND (:endDate IS NULL OR t.date <= :endDate)
            GROUP BY c.id, c.name, c.icon, c.color
            ORDER BY SUM(t.amount) DESC
            """)
    List<CategorySummaryResponse> getCategorySummary(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT new com.financetracker.dto.response.MonthlySummaryResponse(
                YEAR(t.date), MONTH(t.date),
                SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END),
                SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END)
            )
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.date >= :startDate
            GROUP BY YEAR(t.date), MONTH(t.date)
            ORDER BY YEAR(t.date) ASC, MONTH(t.date) ASC
            """)
    List<MonthlySummaryResponse> getMonthlySummary(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate
    );

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.date DESC, t.createdAt DESC")
    List<Transaction> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.date BETWEEN :start AND :end ORDER BY t.date DESC")
    List<Transaction> findByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
