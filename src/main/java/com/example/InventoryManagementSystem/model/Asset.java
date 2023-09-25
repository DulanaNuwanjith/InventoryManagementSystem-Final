package com.example.InventoryManagementSystem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@Document(collection = "assets")
public class Asset {

    @Id
    private String id;
    private UUID assetId;
    private String assetName;
    private Status.EStatus assetStatus;
    private AssetType assetType;
    private Long user;

}
