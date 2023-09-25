package com.example.InventoryManagementSystem.service;

import com.example.InventoryManagementSystem.dto.request.UpdateProfileRequest;
import com.example.InventoryManagementSystem.dto.response.UpdateProfileResponse;
import com.example.InventoryManagementSystem.model.Asset;
import com.example.InventoryManagementSystem.model.Status;
import com.example.InventoryManagementSystem.model.User;
import com.example.InventoryManagementSystem.repository.AssetRepository;
import com.example.InventoryManagementSystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    @Autowired
    UserRepository userRepository;
    @Autowired
    AssetRepository assetRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("Loading user by username: {}", username);
        User user = (User) userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return UserDetailsImpl.build(user);
    }

    public ResponseEntity<?> updateProfile(UpdateProfileRequest updateProfileRequest) {
        logger.info("Received request to update profile.");
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userDetails.getId()));
        user.setFirstName(updateProfileRequest.getFirstName());
        user.setLastName(updateProfileRequest.getLastName());
        user.setPhoneno(updateProfileRequest.getPhoneno());
        userRepository.save(user);
        logger.info("Profile updated successfully for user: {}", userDetails.getUsername());
        return ResponseEntity.ok(new UpdateProfileResponse("Profile updated successfully"));
    }

    public Optional<User> getUserByUsername(String username) {
        logger.info("Attempting to retrieve user by username: {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            logger.info("User found for username: {}", username);
        } else {
            logger.warn("User not found for username: {}", username);
        }
        return user;
    }

    public String findFirstNameByUserId(Long userId) {
        logger.info("Finding first name for user with ID: {}", userId);

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            String firstName = userOptional.get().getFirstName();
            logger.info("Found first name: {}", firstName);
            return firstName;
        } else {
            logger.warn("User with ID {} not found", userId);
            return null;
        }
    }

    public void updateUserState(long userId, User.UserState newState) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        user.setState(newState);
        userRepository.save(user);
        if (newState == User.UserState.INACTIVE) {
            List<Asset> userAssets = assetRepository.findByUser(userId);
            for (Asset asset : userAssets) {
                asset.setAssetStatus(Status.EStatus.AVAILABLE);
                asset.setUser(null);
                assetRepository.save(asset);
            }
        }
    }
}