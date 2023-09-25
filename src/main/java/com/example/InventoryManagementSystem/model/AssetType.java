package com.example.InventoryManagementSystem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;

@Getter
@Setter
@Document(collection = "assetTypes")
public class AssetType {

    @Id
    private String id;
    private long typeId;
    private String typeName;
}
