package com.ssafy.homeland.api.response.notice;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NoticeListRes {
    Long id;
    String title;
    LocalDateTime createdAt;
}
