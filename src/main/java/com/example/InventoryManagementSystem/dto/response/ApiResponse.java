package com.example.InventoryManagementSystem.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
    private boolean success;
    private String message;
    private Long id;
    private String typeName;

    public ApiResponse(boolean success, String message, Long id, String typeName) {
        this.success = success;
        this.message = message;
        this.id = id;
        this.typeName = typeName;
    }

}

