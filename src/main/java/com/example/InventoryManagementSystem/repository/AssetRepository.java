package com.example.InventoryManagementSystem.repository;

import com.example.InventoryManagementSystem.model.Asset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AssetRepository extends MongoRepository<Asset, String> {

    Asset findByAssetId(UUID assetId);
    boolean existsByAssetName(String assetName);
    List<Asset> findByUser(Long userId);
    @Query(value = "{'assetType.typeName': ?0}")
    List<Asset> findByAssetType(String typeName);

}
