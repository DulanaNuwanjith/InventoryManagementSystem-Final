package com.example.InventoryManagementSystem.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileResponse {
    private String message;

    public UpdateProfileResponse(String message) {
        this.message = message;
    }
}

