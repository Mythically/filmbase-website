package com.mariyannakev.assignment.rest.services;

import com.mariyannakev.assignment.rest.data.Film;
import com.mariyannakev.assignment.rest.data.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

import static com.mariyannakev.assignment.rest.utils.isNumeric.isNumeric;

@Service
public class FilmService {
    private FilmRepository filmRepository;

    @Autowired
    public FilmService(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    public Integer countAll() {
        return filmRepository.countAll();
    }
    @Cacheable(value = "films")
    public Page<Film> getAllFilms(Pageable pageable) {
        return filmRepository.findAll(pageable);
    }

    public Film findById(Integer id) {
        return filmRepository.findById(id).orElse(null);
    }

    public List<Film> getFilmsByTitle(String title) {
        return filmRepository.findByTitleContainingIgnoreCase(title);
    }
    @Cacheable("films")
    public List<Film> searchFilms(String searchString) {
        searchString = searchString.trim();
            if (isNumeric(searchString)) {
            return filmRepository.searchInt(Integer.parseInt(searchString));
        } else {
            return filmRepository.search(searchString);
        }

    }
    public Film add(Film film) {
        return filmRepository.save(film);
    }

    public Film update(Integer id, Film film) {
        film.setId(id);
        return filmRepository.save(film);
    }

    public void delete(Integer id) {
        filmRepository.deleteById(id);
    }
}
