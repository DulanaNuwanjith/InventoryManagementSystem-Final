package com.example.InventoryManagementSystem.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssetTypeRequest {
    private long typeId;
    private String typeName;
}
