package com.mariyannakev.assignment.rest.api;
import com.mariyannakev.assignment.rest.data.Film;
import com.mariyannakev.assignment.rest.services.FilmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import java.util.List;

@RestController
@RequestMapping("/films")
public class RespAPI {
    @Autowired
    private FilmService filmService;

    @GetMapping("/search")
    public List<Film> searchFilms(@RequestParam(value = "searchString",required = false) String searchString) {
            return filmService.searchFilms(searchString);
    }
    @Cacheable("allFilms")
    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
    @ResponseBody
    public List<Film> getAllFilms() {
        System.out.println(filmService.countAll());
        return filmService.getAllFilms(Pageable.unpaged()).getContent();
    }


    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
    public Film addFilm(@RequestBody Film film) {
        return filmService.add(film);
    }

    @PutMapping(value ="/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
    public Film updateFilm(@PathVariable Integer id, @RequestBody Film film) {
        return filmService.update(id, film);
    }

    @DeleteMapping(value = "/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
    public void deleteFilm(@PathVariable Integer id) {
        filmService.delete(id);
    }
}

