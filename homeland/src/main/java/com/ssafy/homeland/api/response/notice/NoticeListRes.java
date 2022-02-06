package com.ssafy.homeland.api.response.notice;

import com.ssafy.homeland.db.entity.Notice;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NoticeListRes {
    Long id;
    String title;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    public NoticeListRes(Notice entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdateAt();
    }
}
