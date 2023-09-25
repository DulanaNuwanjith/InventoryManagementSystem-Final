package com.example.InventoryManagementSystem.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePasswordResponse {
    private String message;

    public UpdatePasswordResponse(String message) {
        this.message = message;
    }
}