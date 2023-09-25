package com.example.InventoryManagementSystem.repository;

import com.example.InventoryManagementSystem.model.AssetType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssetTypeRepository extends MongoRepository<AssetType, Long> {
    boolean existsByTypeName(String typeName);
    AssetType findByTypeId(long typeId);
    Optional<AssetType> findByTypeName(String typeName);
}
