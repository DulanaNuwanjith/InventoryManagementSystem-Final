package com.example.InventoryManagementSystem.controller;

import com.example.InventoryManagementSystem.dto.request.*;
import com.example.InventoryManagementSystem.dto.response.JwtResponse;
import com.example.InventoryManagementSystem.dto.response.MessageResponse;
import com.example.InventoryManagementSystem.dto.response.UserResponse;
import com.example.InventoryManagementSystem.model.Role;
import com.example.InventoryManagementSystem.model.User;
import com.example.InventoryManagementSystem.repository.RoleRepository;
import com.example.InventoryManagementSystem.repository.UserRepository;
import com.example.InventoryManagementSystem.security.jwt.JwtUtils;
import com.example.InventoryManagementSystem.service.SequenceGeneratorService;
import com.example.InventoryManagementSystem.service.UserDetailsImpl;
import com.example.InventoryManagementSystem.service.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private SequenceGeneratorService service;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("The /signin endpoint has been reached");
        try {
            User user = (User) userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + loginRequest.getUsername()));
            if (user.getState() != User.UserState.ACTIVE) {
                logger.warn("Inactive user attempting to log in");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("User is not active. Contact an administrator."));
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
            logger.info("Active user {} has successfully logged in", loginRequest.getUsername());
            logger.info("Token successfully generated");
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (BadCredentialsException e) {
            logger.warn("Passwords don't match");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid username or password"));
        } catch (UsernameNotFoundException e) {
            logger.warn("User not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("User not found"));
        }
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) {
        logger.info("The /signup endpoint has been reached");
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            logger.error("Username is already taken");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }


        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            logger.error("Email is already in use");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User();
        user.setFirstName(registrationRequest.getFirstName());
        user.setLastName(registrationRequest.getLastName());
        user.setPhoneno(registrationRequest.getPhoneno());
        user.setUsername(registrationRequest.getUsername());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(encoder.encode(registrationRequest.getPassword()));
        user.setState(User.UserState.ACTIVE);
        logger.info("Password has been encoded");
        Set<String> strRoles = registrationRequest.getRoles();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                    .orElseThrow(() -> {
                        logger.error("Role is not found");
                        return new RuntimeException("Error: Role is not found.");
                    });
            logger.info("The user has been assigned the role of ROLE_USER");
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                                .orElseThrow(() -> {
                                    logger.error("Role is not found");
                                    return new RuntimeException("Error: Role is not found.");
                                });
                        logger.info("The user has been assigned the role of ADMIN");
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                                .orElseThrow(() -> {
                                    logger.error("Role is not found");
                                    return new RuntimeException("Error: Role is not found.");
                                });
                        logger.info("The user has been assigned the role of ROLE_USER");
                        roles.add(userRole);
                }
            });
        }
        user.setId(service.getSequenceNumber(User.SEQUENCE_NAME));
        user.setRoles(roles);
        logger.info("All roles have been assigned to the user");
        userRepository.save(user);
        logger.info("User successfully saved to the database");
        logger.info("User registered successfully!");
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PutMapping("/updateprofile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest) {
        return userDetailsService.updateProfile(updateProfileRequest);
    }

    @PutMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        logger.info("Received request to update password.");
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userDetails.getId()));
        if (!encoder.matches(updatePasswordRequest.getOldPassword(), user.getPassword())) {
            logger.warn("Failed to update password for user: {} - Old password is incorrect", userDetails.getUsername());
            return ResponseEntity.badRequest().body(new MessageResponse("Old password is incorrect"));
        }
        user.setPassword(encoder.encode(updatePasswordRequest.getNewPassword()));
        userRepository.save(user);
        logger.info("Password updated successfully for user: {}", userDetails.getUsername());
        return ResponseEntity.ok(new MessageResponse("Password updated successfully"));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        logger.info("Received request to get all users.");
        List<User> users = userRepository.findAll();
        List<UserResponse> userResponses = users.stream()
                .filter(user -> user.getState() == User.UserState.ACTIVE) // Filter only active users
                .map(user -> {
                    UserResponse userResponse = new UserResponse();
                    userResponse.setId(user.getId());
                    userResponse.setFirstName(user.getFirstName());
                    userResponse.setLastName(user.getLastName());
                    userResponse.setUsername(user.getUsername());
                    userResponse.setEmail(user.getEmail());
                    userResponse.setPhoneno(user.getPhoneno());
                    userResponse.setRoles(user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList()));
                    return userResponse;
                })
                .collect(Collectors.toList());
        logger.info("Retrieved {} active users.", userResponses.size());
        return ResponseEntity.ok(userResponses);
    }


    @PutMapping("/updateuserstate/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateUserState(@PathVariable long userId, @RequestBody UpdateUserStateRequest request) {
        User.UserState newState = request.getNewState();
        userDetailsService.updateUserState(userId, newState);
        String action = (newState == User.UserState.ACTIVE) ? "activated" : "deactivated";
        logger.info("User with ID {} has been {}.", userId, action);
        String responseMessage = String.format("User %s successfully.", action);
        return ResponseEntity.ok(new MessageResponse(responseMessage));
    }

    @GetMapping("/user")
    public ResponseEntity<Optional<User>> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails userDetails) {
            String username = userDetails.getUsername();
            logger.info("Attempting to retrieve user details for username: {}", username);
            Optional<User> user = userDetailsService.getUserByUsername(username);
            if (user.isPresent()) {
                logger.info("User details retrieved successfully for username: {}", username);
                return ResponseEntity.ok(user);
            } else {
                logger.warn("User details not found for username: {}", username);
            }
        } else {
            logger.warn("Unauthorized access attempted");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{userId}/firstname")
    public ResponseEntity<String> getFirstNameByUserId(@PathVariable Long userId) {
        String firstName = userDetailsService.findFirstNameByUserId(userId);
        if (firstName != null) {
            return ResponseEntity.ok(firstName);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
