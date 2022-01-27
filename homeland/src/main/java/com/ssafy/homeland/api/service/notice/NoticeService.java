package com.ssafy.homeland.api.service.notice;
import com.ssafy.homeland.api.request.notice.NoticePostReq;
import com.ssafy.homeland.db.entity.Notice;

public interface NoticeService {
    Notice createNotice(NoticePostReq noticeInfo);
    Long deleteNotice(Long noticeId);


}
