package com.example.InventoryManagementSystem.controller;

import com.example.InventoryManagementSystem.dto.request.AssetRequest;
import com.example.InventoryManagementSystem.dto.request.UpdateAssetRequest;
import com.example.InventoryManagementSystem.dto.response.ApiResponseAsset;
import com.example.InventoryManagementSystem.model.Asset;
import com.example.InventoryManagementSystem.model.Status;
import com.example.InventoryManagementSystem.service.AssetService;
import com.example.InventoryManagementSystem.service.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;
    private static final Logger logger = LoggerFactory.getLogger(AssetController.class);


    @Autowired
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponseAsset> addAsset(@RequestBody AssetRequest assetRequest) {
        logger.info("Received request to add asset with name: {}", assetRequest.getAssetName());
        ResponseEntity<Map<String, Object>> serviceResponse = assetService.addAsset(assetRequest);
        ApiResponseAsset response;
        if (serviceResponse.getStatusCode().is2xxSuccessful()) {
            response = new ApiResponseAsset("success", "Asset added successfully", serviceResponse.getBody());
        } else {
            response = new ApiResponseAsset("error", "Failed to add asset", serviceResponse.getBody());
        }
        return ResponseEntity.status(serviceResponse.getStatusCode()).body(response);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{assetId}")
    public ResponseEntity<ApiResponseAsset> deleteAsset(@PathVariable UUID assetId) {
        logger.info("Received request to delete asset with assetId: {}", assetId);
        ResponseEntity<String> serviceResponse = assetService.deleteAsset(assetId);
        ApiResponseAsset response;
        if (serviceResponse.getStatusCode().is2xxSuccessful()) {
            response = new ApiResponseAsset("success", "Asset deleted successfully", serviceResponse.getBody());
        } else {
            response = new ApiResponseAsset("error", "Failed to delete asset", serviceResponse.getBody());
        }
        return ResponseEntity.status(serviceResponse.getStatusCode()).body(response);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{assetId}")
    public ResponseEntity<ApiResponseAsset> updateAsset(@PathVariable UUID assetId, @RequestBody UpdateAssetRequest request) {
        logger.info("Received request to update asset with assetId: {}", assetId);
        boolean updated = assetService.updateAssetWithRequest(assetId, request);
        ApiResponseAsset response;
        if (updated) {
            response = new ApiResponseAsset("success", "Asset updated successfully", null);
            return ResponseEntity.ok(response);
        } else {
            String message = "Asset not found for assetId: " + assetId;
            response = new ApiResponseAsset("error", message, null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/by-status")
    public ResponseEntity<Map<Status.EStatus, ArrayList<Asset>>> getAssetsByStatus() {
        logger.info("Received request to get assets by status.");
        return assetService.getAssetsByStatus();
    }

    @GetMapping("/view/{assetId}")
    public ResponseEntity<Object> getAssetByAssetId(@PathVariable UUID assetId) {
        logger.info("Received request to get asset by assetId: {}", assetId);
        return assetService.getAssetByAssetId(assetId);
    }

    @GetMapping("/my/assets")
    public ResponseEntity<List<Asset>> viewCurrentUserAssets() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long currentUserId = userDetails.getId();
        return assetService.viewUserAssets(currentUserId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Asset>> getAllAssetTypes() {
        logger.info("Received request to get all assets.");
        return assetService.getAllAsset();
    }

    @GetMapping("/byAssetTypeName/{typeName}")
    public List<Asset> getAssetsByAssetTypeName(@PathVariable String typeName) {
        return assetService.getAssetsByAssetTypeName(typeName);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Asset>> getAssetsByUser(@PathVariable Long userId) {
        List<Asset> userAssets = assetService.getAssetsByUserId(userId);
        if (userAssets.isEmpty()) {
            logger.warn("No assets found for user with userId: {}", userId);
            return ResponseEntity.notFound().build();
        }
        logger.info("Retrieved assets for user with userId: {}", userId);
        return ResponseEntity.ok(userAssets);
    }
}