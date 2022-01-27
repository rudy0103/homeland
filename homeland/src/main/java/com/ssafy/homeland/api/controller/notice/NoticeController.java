package com.ssafy.homeland.api.controller.notice;
import com.ssafy.homeland.api.request.notice.NoticePostReq;
import com.ssafy.homeland.api.service.notice.NoticeService;
import com.ssafy.homeland.db.entity.Notice;
import com.ssafy.homeland.db.repository.NoticeRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/notice")
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    @Autowired
    NoticeRepository noticeRepository;

    @GetMapping
    public List<Map<String, Object>> list() {
        List<Map<String, Object>> result = new ArrayList<>();
        noticeRepository.findAll().forEach(noticeList -> {
            Map<String, Object> obj = new HashMap<>();
            obj.put("id", noticeList.getId());
            obj.put("title", noticeList.getTitle());
            result.add(obj);
        });
        return result;
    }

    @GetMapping("/{noticeId}")
    public Map<String, Object> notice(@PathVariable Long noticeId) {
        var option = noticeRepository.findById(noticeId);
        if (!option.isPresent()) {
            return null;
        }
        Notice notice = option.get();
        Map<String, Object> obj = new HashMap<>();
        obj.put("id", notice.getId());
        obj.put("title", notice.getTitle());
        obj.put("content", notice.getContent());
        return obj;
    }

    @DeleteMapping("/{noticeId}")
    public void delete(@PathVariable Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }

    @PostMapping
    public Long post(@RequestBody Map<String, Object> body) {
        return noticeRepository.save(Notice.builder()
                .title(body.get("title").toString())
                .content(body.get("content").toString())
                .createdAt(LocalDateTime.now())
                .build()).getId();
    }

    public Map<String,Object> update(@PathVariable Long noticeId, @RequestBody Map<String,Object> body){
        var option = noticeRepository.findById(noticeId);
        if(!option.isPresent()){
            return null;
        }
        Notice notice = option.get();
        notice.setTitle(body.get("title").toString());
        notice.setContent(body.get("content").toString());
        noticeRepository.save(notice);
        return Map.of("message", "수정 성공");
    }


//    @PostMapping()
//    public Notice createNotice(@RequestBody NoticePostReq noticeInfo) {
//        Notice notice = noticeService.createNotice(noticeInfo);
//        return notice;
//    }
//
//    @GetMapping()
//    public List<Object[]> notices() {
//        List<Object[]> notices = noticeRepository.findNoticeList();
//        return notices;
//    }
//
//    @GetMapping("/{noticeId}")
//    public Optional<Notice> notice(@PathVariable Long noticeId) {
//        Optional<Notice> notice = noticeRepository.findById(noticeId);
//        return notice;
//    }
//
//    @DeleteMapping("/{noticeId}")
//    public Long delete(@PathVariable Long noticeId){
//        return noticeService.deleteNotice(noticeId);
//    }

//    @PutMapping("/{noticeId}")
//    public Long update(@PathVariable Long noticeId, @RequestBody NoticePostReq noticeInfo) {
//        return noticeService.update(noticeId, noticeInfo);
//    }



}
