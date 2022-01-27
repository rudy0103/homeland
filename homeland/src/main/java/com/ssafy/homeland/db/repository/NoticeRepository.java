package com.ssafy.homeland.db.repository;
import com.ssafy.homeland.db.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice,Long> {
    Optional<Notice> findById(Long id);

    @Query(value = "select id, title from Notice")
    List<Object[]> findNoticeList();
}
