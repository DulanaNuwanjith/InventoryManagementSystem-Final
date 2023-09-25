package com.example.InventoryManagementSystem.service;

import com.example.InventoryManagementSystem.dto.request.AssetRequest;
import com.example.InventoryManagementSystem.dto.request.UpdateAssetRequest;
import com.example.InventoryManagementSystem.model.Asset;
import com.example.InventoryManagementSystem.model.AssetType;
import com.example.InventoryManagementSystem.model.Status;
import com.example.InventoryManagementSystem.repository.AssetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetTypeService assetTypeService;
    private static final Logger logger = LoggerFactory.getLogger(AssetService.class);

    @Autowired
    public AssetService(AssetRepository assetRepository, AssetTypeService assetTypeService) {
        this.assetRepository = assetRepository;
        this.assetTypeService = assetTypeService;
    }

    public ResponseEntity<Map<String, Object>> addAsset(AssetRequest assetRequest) {
        Map<String, Object> response = new HashMap<>();
        if (assetRequest == null) {
            response.put("error", "AssetRequest is null.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        String assetName = assetRequest.getAssetName();
        Status.EStatus assetStatus = assetRequest.getAssetStatuses();
        if (!assetTypeService.assetTypeExistsByName(assetRequest.getTypeName())) {
            response.put("error", "Invalid asset type name.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (assetName.length() < 4) {
            response.put("error", "Asset name must have at least 4 characters.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (existsAssetWithAssetName(assetRequest.getAssetName())) {
            response.put("error", "Asset with the same name already exists.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        AssetType assetType = assetTypeService.getAssetTypeByName(assetRequest.getTypeName());
        try {
            Asset addedAsset = addAsset(assetRequest.getAssetName(), assetType, assetStatus);
            response.put("message", "Asset added successfully");
            response.put("assetId", addedAsset.getAssetId());
            response.put("assetName", addedAsset.getAssetName());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    public Asset addAsset(String assetName, AssetType assetType, Status.EStatus assetStatus) {
        logger.info("Adding asset with name: {}, type: {}, status: {}", assetName, assetType.getTypeName(), assetStatus);
        if (assetName == null) {
            throw new IllegalArgumentException("Asset name cannot be null.");
        }
        if (assetType == null) {
            throw new IllegalArgumentException("Asset type cannot be null.");
        }
        UUID newAssetId = UUID.randomUUID();
        Asset asset = new Asset();
        asset.setAssetId(newAssetId);
        asset.setAssetName(assetName);
        asset.setAssetType(assetType);
        asset.setAssetStatus(Status.EStatus.AVAILABLE);
        Asset savedAsset = assetRepository.save(asset);
        logger.info("Asset added successfully with ID: {}, assetId: {}", savedAsset.getId(), savedAsset.getAssetId());
        return savedAsset;
    }

    public boolean existsAssetWithAssetName(String assetName) {
        logger.info("Checking if asset exists with assetName: {}", assetName);
        return assetRepository.existsByAssetName(assetName);
    }

    public ResponseEntity<String> deleteAsset(UUID assetId) {
        if (assetId == null) {
            String errorMessage = "AssetId is null. Please provide a valid assetId.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
        boolean deleted = deleteAssetByAssetId(assetId);
        if (deleted) {
            return ResponseEntity.ok("Asset with assetId " + assetId + " has been deleted.");
        } else {
            String errorMessage = "Asset with assetId " + assetId + " not found for deletion.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }

    public boolean deleteAssetByAssetId(UUID assetId) {
        if (assetId == null) {
            logger.warn("AssetId is null. Cannot delete asset with null assetId.");
            return false;
        }
        logger.info("Deleting asset with assetId: {}", assetId);
        Asset asset = assetRepository.findByAssetId(assetId);
        if (asset != null) {
            assetRepository.delete(asset);
            logger.info("Asset with assetId {} deleted successfully.", assetId);
            return true;
        } else {
            logger.warn("Asset with assetId {} not found for deletion.", assetId);
            return false;
        }
    }

    public boolean updateAssetWithRequest(UUID assetId, UpdateAssetRequest request) {
        if (assetId == null) {
            logger.warn("AssetId is null. Cannot update asset with null assetId.");
            return false;
        }
        if (request == null) {
            logger.warn("UpdateAssetRequest is null. Please provide a valid request.");
            return false;
        }
        logger.info("Updating asset with assetId: {}", assetId);
        Asset asset = assetRepository.findByAssetId(assetId);
        if (asset == null) {
            logger.warn("Asset with assetId {} not found for update.", assetId);
            return false;
        }
        if (request.getStatus() != null) {
            asset.setAssetStatus(request.getStatus());
            logger.info("Updated asset status to: {} for assetId: {}", request.getStatus(), assetId);
        }
        if (request.getUser() != null && request.getUser().describeConstable().isPresent()) {
            asset.setUser(request.getUser());
            logger.info("Updated asset user to: {} for assetId: {}", request.getUser(), assetId);
        } else {
            asset.setUser(null);
            logger.info("Updated asset user to null for assetId: {}", assetId);
        }
        assetRepository.save(asset);
        logger.info("Asset with assetId {} updated successfully.", assetId);
        return true;
    }

    public ResponseEntity<Map<Status.EStatus, ArrayList<Asset>>> getAssetsByStatus() {
        logger.info("Fetching assets grouped by status.");
        List<Asset> allAssets = assetRepository.findAll();
        if (allAssets == null) {
            logger.warn("Asset list is null. Unable to retrieve assets.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        Map<Status.EStatus, ArrayList<Asset>> assetsByStatus = allAssets.stream()
                .collect(Collectors.groupingBy(Asset::getAssetStatus, Collectors.toCollection(ArrayList::new)));
        if (assetsByStatus.isEmpty()) {
            logger.warn("No assets found by status.");
            return ResponseEntity.notFound().build();
        } else {
            logger.info("Retrieved assets by status successfully.");
            return ResponseEntity.ok(assetsByStatus);
        }
    }


    public ResponseEntity<Object> getAssetByAssetId(UUID assetId) {
        if (assetId == null) {
            logger.warn("AssetId is null. Please provide a valid assetId.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid assetId.");
        }
        logger.info("Fetching asset by assetId: {}", assetId);
        Asset asset = assetRepository.findByAssetId(assetId);
        if (asset != null) {
            logger.info("Fetched asset by assetId: {}", assetId);
            return ResponseEntity.ok(asset);
        } else {
            logger.warn("Asset not found for assetId: {}", assetId);
            String message = "Asset not found for assetId: " + assetId;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
        }
    }

    public ResponseEntity<List<Asset>> viewUserAssets(Long userId) {
        if (userId == null) {
            logger.warn("UserId is null. Please provide a valid userId.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        logger.info("Fetching assets for user with userId: {}", userId);
        List<Asset> userAssets = getAssetsByUser(userId);
        if (userAssets.isEmpty()) {
            logger.warn("No assets found for user with userId: {}", userId);
            return ResponseEntity.notFound().build();
        }
        logger.info("Retrieved assets for user with userId: {}", userId);
        return ResponseEntity.ok(userAssets);
    }

    private List<Asset> getAssetsByUser(Long userId) {
        return assetRepository.findByUser(userId);
    }

    public ResponseEntity<List<Asset>> getAllAsset() {
        List<Asset> asset = assetRepository.findAll();
        if (asset == null) {
            logger.warn("Failed to retrieve assets. The result from assetRepository.findAll() is null.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        logger.info("Retrieved {} assets.", asset.size());
        return ResponseEntity.ok(asset);
    }

    public List<Asset> getAssetsByAssetTypeName(String typeName) {
        if (typeName == null) {
            logger.warn("Asset type name is null. Please provide a valid typeName.");
            return Collections.emptyList(); // Return an empty list if typeName is null.
        }
        return assetRepository.findByAssetType(typeName);
    }

    public List<Asset> getAssetsByUserId(Long user) {
        if (user == null) {
            logger.warn("User ID is null. Please provide a valid user ID.");
            return Collections.emptyList();
        }
        return assetRepository.findByUser(user);
    }

}