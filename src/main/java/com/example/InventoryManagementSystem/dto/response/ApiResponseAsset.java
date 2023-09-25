package com.example.InventoryManagementSystem.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ApiResponseAsset {
    private String status;
    private String message;
    private Object data;

    public ApiResponseAsset(String status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
