package com.financetracker.repository;

import com.financetracker.entity.Category;
import com.financetracker.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId OR (c.user IS NULL AND c.isDefault = true) ORDER BY c.type, c.name")
    List<Category> findAllByUserIdOrDefault(@Param("userId") Long userId);

    List<Category> findByUserIdAndType(Long userId, TransactionType type);

    List<Category> findByIsDefaultTrueOrderByTypeAscNameAsc();

    boolean existsByNameAndUserId(String name, Long userId);
}
