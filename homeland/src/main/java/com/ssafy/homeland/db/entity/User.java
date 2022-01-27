package com.ssafy.homeland.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import java.time.LocalDateTime;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User extends BaseEntity{
    private String authority;
    private String email;
    private String nickname;
    private String userId;
    private LocalDateTime createdAt;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String password;
}
