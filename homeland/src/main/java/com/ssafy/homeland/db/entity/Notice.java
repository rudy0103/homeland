package com.ssafy.homeland.db.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.PrePersist;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Notice extends BaseEntity {

    private String title;
    private String content;
    private LocalDateTime createdAt;

    @Builder
    public Notice(String title, String content, LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }

//    @PrePersist
//    public void createdAt() {
//        this.createdAt = LocalDateTime.now();
//    }
//
}
