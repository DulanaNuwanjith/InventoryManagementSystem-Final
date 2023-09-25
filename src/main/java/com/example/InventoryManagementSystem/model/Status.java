package com.example.InventoryManagementSystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "statuses")
public class Status {
    @Id
    private String id;
    private EStatus name;

    public enum EStatus {
        AVAILABLE,
        IN_USE,
        UNDER_REPAIR
    }

}