package com.example.InventoryManagementSystem.service;

import com.example.InventoryManagementSystem.dto.request.AssetTypeRequest;
import com.example.InventoryManagementSystem.dto.response.ApiResponse;
import com.example.InventoryManagementSystem.model.AssetType;
import com.example.InventoryManagementSystem.repository.AssetTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetTypeService {

    @Autowired
    private AssetTypeRepository assetTypeRepository;
    private static final Logger logger = LoggerFactory.getLogger(AssetTypeService.class);

    @Autowired
    public AssetTypeService(AssetTypeRepository assetTypeRepository) {
        this.assetTypeRepository = assetTypeRepository;
    }

    public ResponseEntity<List<AssetType>> getAllAssetTypes() {
        List<AssetType> assetTypes = assetTypeRepository.findAll();
        if (assetTypes == null) {
            logger.warn("Failed to retrieve asset types. The result from assetTypeRepository.findAll() is null.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        logger.info("Retrieved {} asset types.", assetTypes.size());
        return ResponseEntity.ok(assetTypes);
    }

    public ResponseEntity<Object> getAssetTypeByTypeId(long typeId) {
        if (typeId <= 0) {
            logger.warn("Invalid typeId. Please provide a valid positive typeId.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid typeId.");
        }
        AssetType assetType = findAssetTypeByTypeId(typeId);
        if (assetType != null) {
            logger.info("Retrieved asset type with typeId {}: {}", typeId, assetType);
            return ResponseEntity.ok(assetType);
        } else {
            logger.warn("Asset type with typeId {} not found.", typeId);
            String errorMessage = "Asset type with typeId " + typeId + " not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }

    public AssetType findAssetTypeByTypeId(long typeId) {
        if (typeId <= 0) {
            logger.warn("Invalid typeId. Please provide a valid positive typeId.");
            return null;
        }
        logger.info("Fetching asset type by typeId: {}", typeId);
        return assetTypeRepository.findByTypeId(typeId);
    }

    public ResponseEntity<ApiResponse> addAssetTypeResponse(AssetTypeRequest assetTypeRequest) {
        if (assetTypeRequest == null) {
            logger.warn("AssetTypeRequest is null. Please provide a valid request.");
            ApiResponse response = new ApiResponse(false, "Invalid asset type request", null, null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        logger.info("Adding asset type with name: {}", assetTypeRequest.getTypeName());
        String typeName = assetTypeRequest.getTypeName();
        if (typeName.length() < 4) {
            ApiResponse response = new ApiResponse(false, "Asset type name must have at least 4 characters", null, null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        try {
            if (existsByTypeName(assetTypeRequest.getTypeName())) {
                logger.warn("Asset type name '{}' already exists.", assetTypeRequest.getTypeName());
                ApiResponse response = new ApiResponse(false, "Asset type name already exists", null, null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            AssetType newAssetType = new AssetType();
            Long nextId = getNextAssetTypeId();
            logger.info("Next asset type ID: {}", nextId);
            newAssetType.setTypeId(nextId);
            newAssetType.setTypeName(assetTypeRequest.getTypeName());
            AssetType savedAssetType = assetTypeRepository.save(newAssetType);
            logger.info("Asset type added successfully with ID: {}", savedAssetType.getTypeId());
            ApiResponse response = new ApiResponse(true, "Asset type added successfully", savedAssetType.getTypeId(), savedAssetType.getTypeName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Failed to add asset type: {}", e.getMessage());
            ApiResponse response = new ApiResponse(false, "Failed to add asset type", null, null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    private Long getNextAssetTypeId() {
        logger.info("Fetching next asset type ID.");
        List<AssetType> allAssetTypes = assetTypeRepository.findAll();
        if (allAssetTypes.isEmpty()) {
            logger.info("No existing asset types. Assigning ID: 1");
            return 1L;
        }
        Long lastId = allAssetTypes.get(allAssetTypes.size() - 1).getTypeId();
        logger.info("Last asset type ID: {}", lastId);
        Long nextId = lastId + 1;
        logger.info("Next asset type ID: {}", nextId);
        return nextId;
    }

    public ResponseEntity<String> deleteAssetTypeByTypeId(long typeId) {
        logger.info("Received request to delete asset type with typeId: {}", typeId);
        boolean deleted = deleteAssetType(typeId);
        if (deleted) {
            logger.info("Asset type with typeId {} has been deleted.", typeId);
            return ResponseEntity.ok("Asset type with typeId " + typeId + " deleted.");
        } else {
            logger.warn("Asset type with typeId {} not found for deletion.", typeId);
            String errorMessage = "Asset type with typeId " + typeId + " not found for deletion.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }

    public boolean deleteAssetType(long typeId) {
        logger.info("Deleting asset type with typeId: {}", typeId);
        AssetType assetType = assetTypeRepository.findByTypeId(typeId);
        if (assetType != null) {
            assetTypeRepository.delete(assetType);
            logger.info("Asset type with typeId {} deleted successfully.", typeId);
            return true;
        } else {
            logger.warn("Asset type with typeId {} not found for deletion.", typeId);
            return false;
        }
    }

    public ResponseEntity<Object> updateAssetType(long typeId, AssetTypeRequest updatedAssetType) {
        logger.info("Received request to update asset type with typeId: {}", typeId);
        AssetType updatedType = updateExistingAssetType(typeId, updatedAssetType);
        if (updatedType != null) {
            logger.info("Asset type with typeId {} has been updated successfully.", typeId);
            return ResponseEntity.ok(updatedType);
        } else {
            logger.warn("Failed to update asset type with typeId {}. A type with the provided name already exists.", typeId);
            return ResponseEntity
                    .badRequest()
                    .body("Failed to update asset type. A type with the provided name already exists.");
        }
    }

    public AssetType updateExistingAssetType(long typeId, AssetTypeRequest updatedAssetType) {
        logger.info("Updating asset type with typeId: {}", typeId);
        AssetType existingAssetType = assetTypeRepository.findByTypeId(typeId);
        if (existingAssetType != null) {
            String newTypeName = updatedAssetType.getTypeName();
            String currentTypeName = existingAssetType.getTypeName();
            if (!currentTypeName.equals(newTypeName) && assetTypeExistsByName(newTypeName)) {
                logger.warn("Asset type name '{}' already exists.", newTypeName);
                return null;
            }
            existingAssetType.setTypeName(newTypeName);
            AssetType updatedType = assetTypeRepository.save(existingAssetType);
            logger.info("Updated asset type with typeId {} successfully.", typeId);
            return updatedType;
        } else {
            logger.warn("Asset type with typeId {} not found for update.", typeId);
            return null;
        }
    }

    public boolean existsByTypeName(String typeName) {
        logger.info("Checking if asset type exists with typeName: {}", typeName);
        return assetTypeRepository.existsByTypeName(typeName);
    }


    public AssetType getAssetTypeByName(String typeName) {
        logger.info("Fetching asset type by name: {}", typeName);
        Optional<AssetType> assetType = assetTypeRepository.findByTypeName(typeName);
        if (assetType.isPresent()) {
            logger.info("Fetched asset type by name: {}", typeName);
            return assetType.get();
        } else {
            logger.warn("Asset type not found for name: {}", typeName);
            throw new IllegalArgumentException("Asset type not found.");
        }
    }

    public boolean assetTypeExistsByName(String typeName) {
        logger.info("Checking if asset type exists with typeName: {}", typeName);
        return assetTypeRepository.existsByTypeName(typeName);
    }

}

