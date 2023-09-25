package com.example.InventoryManagementSystem.controller;

import com.example.InventoryManagementSystem.dto.request.AssetTypeRequest;
import com.example.InventoryManagementSystem.dto.response.ApiResponse;
import com.example.InventoryManagementSystem.model.AssetType;
import com.example.InventoryManagementSystem.service.AssetTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/asset-types")
public class AssetTypeController {

    @Autowired
    private final AssetTypeService assetTypeService;
    private static final Logger logger = LoggerFactory.getLogger(AssetTypeController.class);

    @Autowired
    public AssetTypeController(AssetTypeService assetTypeService) {
        this.assetTypeService = assetTypeService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<AssetType>> getAllAssetTypes() {
        logger.info("Received request to get all asset types.");
        return assetTypeService.getAllAssetTypes();
    }

    @GetMapping("/{typeId}")
    public ResponseEntity<Object> getAssetTypeByTypeId(@PathVariable long typeId) {
        logger.info("Received request to get asset type by typeId: {}", typeId);
        return assetTypeService.getAssetTypeByTypeId(typeId);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addAssetType(@RequestBody AssetTypeRequest assetTypeRequest) {
        return assetTypeService.addAssetTypeResponse(assetTypeRequest);
    }


    @DeleteMapping("/{typeId}")
    public ResponseEntity<ApiResponse> deleteAssetTypeByTypeId(@PathVariable long typeId) {
        ResponseEntity<String> serviceResponse = assetTypeService.deleteAssetTypeByTypeId(typeId);
        ApiResponse response;
        if (serviceResponse.getStatusCode().is2xxSuccessful()) {
            response = new ApiResponse(true, "Asset type deleted successfully", typeId, null);
        } else {
            response = new ApiResponse(false, "Failed to delete asset type", null, null);
        }
        return ResponseEntity.status(serviceResponse.getStatusCode()).body(response);
    }

    @PutMapping("/{typeId}")
    public ResponseEntity<Object> updateAssetType(@PathVariable long typeId, @RequestBody AssetTypeRequest updatedAssetType) {
        return assetTypeService.updateAssetType(typeId, updatedAssetType);
    }

}
