package com.financetracker.dto.request;

import com.financetracker.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @NotNull(message = "Category type is required")
    private TransactionType type;

    @Size(max = 10, message = "Icon too long")
    private String icon;

    @Size(min = 7, max = 7, message = "Color must be a valid hex code (#RRGGBB)")
    private String color;
}
