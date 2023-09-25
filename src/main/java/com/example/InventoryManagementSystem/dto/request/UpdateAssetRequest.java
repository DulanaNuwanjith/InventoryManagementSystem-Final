package com.example.InventoryManagementSystem.dto.request;

import com.example.InventoryManagementSystem.model.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAssetRequest {
    private Status.EStatus status;
    private Long user;
}
