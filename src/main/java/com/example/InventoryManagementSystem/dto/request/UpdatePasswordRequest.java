package com.example.InventoryManagementSystem.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class UpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
