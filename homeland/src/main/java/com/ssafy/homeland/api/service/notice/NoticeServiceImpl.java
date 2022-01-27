package com.ssafy.homeland.api.service.notice;
import com.ssafy.homeland.api.request.notice.NoticePostReq;
import com.ssafy.homeland.db.entity.Notice;
import com.ssafy.homeland.db.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("noticeService")
public class NoticeServiceImpl implements NoticeService{
    @Autowired
    NoticeRepository noticeRepository;

    @Override
    public Notice createNotice(NoticePostReq noticeInfo) {
        Notice notice = new Notice();
        notice.setTitle(noticeInfo.getTitle());
        notice.setContent(noticeInfo.getContent());
        return noticeRepository.save(notice);
    }

    @Override
    public Long deleteNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId).orElseThrow(()->new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
        noticeRepository.delete(notice);
        return notice.getId();

    }

}
