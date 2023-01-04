package com.mariyannakev.assignment.rest.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends JpaRepository<Film, Integer> {
    List<Film> findByTitleContainingIgnoreCase(String title);
    @Query("SELECT COUNT(*) FROM Film")
    Integer countAll();
    @Query("SELECT f FROM Film f WHERE  f.title LIKE %:searchString% OR f.stars LIKE %:searchString% OR f.director LIKE %:searchString% OR f.review LIKE %:searchString%")
    List<Film> search(@Param("searchString") String searchString);

    @Query("SELECT f FROM Film f WHERE  f.id = :searchString OR f.year = :searchString")
    List<Film> searchInt(@Param("searchString")Integer searchString);
}
