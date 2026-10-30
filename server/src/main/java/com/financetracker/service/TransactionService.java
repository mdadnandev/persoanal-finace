package com.financetracker.service;

import com.financetracker.dto.request.TransactionRequest;
import com.financetracker.dto.response.CategoryResponse;
import com.financetracker.dto.response.PagedResponse;
import com.financetracker.dto.response.TransactionResponse;
import com.financetracker.entity.Category;
import com.financetracker.entity.Transaction;
import com.financetracker.entity.TransactionType;
import com.financetracker.entity.User;
import com.financetracker.exception.BadRequestException;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.repository.CategoryRepository;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PagedResponse<TransactionResponse> getTransactions(
            String email, TransactionType type, Long categoryId,
            LocalDate startDate, LocalDate endDate, int page, int size) {

        User user = getUserByEmail(email);
        Pageable pageable = PageRequest.of(page, size);

        Page<Transaction> transactionPage = transactionRepository.findAllByFilters(
                user.getId(), type, categoryId, startDate, endDate, pageable);

        List<TransactionResponse> content = transactionPage.getContent()
                .stream().map(this::mapToResponse).collect(Collectors.toList());

        return PagedResponse.<TransactionResponse>builder()
                .content(content)
                .page(transactionPage.getNumber())
                .size(transactionPage.getSize())
                .totalElements(transactionPage.getTotalElements())
                .totalPages(transactionPage.getTotalPages())
                .last(transactionPage.isLast())
                .first(transactionPage.isFirst())
                .build();
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, String email) {
        User user = getUserByEmail(email);

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .category(category)
                .amount(request.getAmount())
                .type(request.getType())
                .description(request.getDescription())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();

        transaction = transactionRepository.save(transaction);
        log.info("Transaction created: {} {} for user: {}", request.getType(), request.getAmount(), email);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request, String email) {
        User user = getUserByEmail(email);
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        }

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(category);
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setNotes(request.getNotes());

        return mapToResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void deleteTransaction(Long id, String email) {
        User user = getUserByEmail(email);
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        transactionRepository.delete(transaction);
        log.info("Transaction {} deleted for user: {}", id, email);
    }

    public TransactionResponse getTransactionById(Long id, String email) {
        User user = getUserByEmail(email);
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));
        return mapToResponse(transaction);
    }

    public String exportToCsv(String email, LocalDate startDate, LocalDate endDate) {
        User user = getUserByEmail(email);
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(
                user.getId(),
                startDate != null ? startDate : LocalDate.now().minusYears(1),
                endDate != null ? endDate : LocalDate.now()
        );

        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            String[] header = {"Date", "Type", "Category", "Description", "Amount", "Notes"};
            writer.writeNext(header);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (Transaction t : transactions) {
                String[] row = {
                    t.getDate().format(formatter),
                    t.getType().name(),
                    t.getCategory() != null ? t.getCategory().getName() : "Uncategorized",
                    t.getDescription() != null ? t.getDescription() : "",
                    t.getAmount().toPlainString(),
                    t.getNotes() != null ? t.getNotes() : ""
                };
                writer.writeNext(row);
            }
        } catch (Exception e) {
            throw new BadRequestException("Error generating CSV: " + e.getMessage());
        }

        return sw.toString();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public TransactionResponse mapToResponse(Transaction transaction) {
        CategoryResponse categoryResponse = null;
        if (transaction.getCategory() != null) {
            Category c = transaction.getCategory();
            categoryResponse = CategoryResponse.builder()
                    .id(c.getId()).name(c.getName()).type(c.getType())
                    .icon(c.getIcon()).color(c.getColor()).isDefault(c.isDefault())
                    .build();
        }

        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .description(transaction.getDescription())
                .date(transaction.getDate())
                .notes(transaction.getNotes())
                .category(categoryResponse)
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
