package com.financetracker.service;

import com.financetracker.dto.request.CategoryRequest;
import com.financetracker.dto.response.CategoryResponse;
import com.financetracker.entity.Category;
import com.financetracker.entity.TransactionType;
import com.financetracker.entity.User;
import com.financetracker.exception.BadRequestException;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.repository.CategoryRepository;
import com.financetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<CategoryResponse> getAllCategories(String email) {
        User user = getUserByEmail(email);
        return categoryRepository.findAllByUserIdOrDefault(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, String email) {
        User user = getUserByEmail(email);

        if (categoryRepository.existsByNameAndUserId(request.getName(), user.getId())) {
            throw new BadRequestException("Category with this name already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .icon(request.getIcon() != null ? request.getIcon() : "📁")
                .color(request.getColor() != null ? request.getColor() : "#6366f1")
                .isDefault(false)
                .user(user)
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id, String email) {
        User user = getUserByEmail(email);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));

        if (category.isDefault()) {
            throw new BadRequestException("Cannot delete a default category");
        }
        if (!category.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You don't have permission to delete this category");
        }

        categoryRepository.delete(category);
    }

    @Transactional
    public void seedDefaultCategories(User user) {
        List<Category> defaults = List.of(
            // Income categories
            buildDefault("Salary", TransactionType.INCOME, "💼", "#22c55e"),
            buildDefault("Freelance", TransactionType.INCOME, "💻", "#10b981"),
            buildDefault("Investment", TransactionType.INCOME, "📈", "#06b6d4"),
            buildDefault("Gift", TransactionType.INCOME, "🎁", "#a78bfa"),
            buildDefault("Other Income", TransactionType.INCOME, "💰", "#f59e0b"),
            // Expense categories
            buildDefault("Food & Dining", TransactionType.EXPENSE, "🍽️", "#f97316"),
            buildDefault("Transport", TransactionType.EXPENSE, "🚗", "#3b82f6"),
            buildDefault("Shopping", TransactionType.EXPENSE, "🛍️", "#ec4899"),
            buildDefault("Rent", TransactionType.EXPENSE, "🏠", "#8b5cf6"),
            buildDefault("Utilities", TransactionType.EXPENSE, "⚡", "#eab308"),
            buildDefault("Healthcare", TransactionType.EXPENSE, "🏥", "#ef4444"),
            buildDefault("Entertainment", TransactionType.EXPENSE, "🎬", "#14b8a6"),
            buildDefault("Education", TransactionType.EXPENSE, "📚", "#6366f1"),
            buildDefault("Savings", TransactionType.EXPENSE, "🏦", "#0ea5e9"),
            buildDefault("Other Expense", TransactionType.EXPENSE, "📦", "#94a3b8")
        );

        defaults.stream().map(c -> {
            c.setUser(user);
            return c;
        }).forEach(categoryRepository::save);

        log.info("Seeded {} default categories for user: {}", defaults.size(), user.getEmail());
    }

    private Category buildDefault(String name, TransactionType type, String icon, String color) {
        return Category.builder()
                .name(name).type(type).icon(icon).color(color).isDefault(true)
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .icon(category.getIcon())
                .color(category.getColor())
                .isDefault(category.isDefault())
                .build();
    }
}
