package com.example.InventoryManagementSystem.dto.request;

import com.example.InventoryManagementSystem.model.User;
import lombok.Getter;

@Getter
public class UpdateUserStateRequest {

    private User.UserState newState;


}
