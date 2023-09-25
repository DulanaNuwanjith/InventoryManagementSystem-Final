package com.example.InventoryManagementSystem.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Data
@NoArgsConstructor
@Document(collection = "users")
public class User implements Serializable {

    @Transient
    public static String SEQUENCE_NAME = "user_sequence";

    @Id
    private long id;

    private String firstName;
    private String lastName;
    private Long phoneno;

    @NotBlank
    @Size(max = 10)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 50)
    private String password;

    @DBRef
    private Set<Role> roles = new HashSet<>();

    private UserState state;

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public enum UserState {
        ACTIVE,
        INACTIVE
    }
}



