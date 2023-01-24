package com.mariyannakev.assignment.rest.api;
import com.mariyannakev.assignment.rest.data.Film;
import com.mariyannakev.assignment.rest.services.FilmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/films")
public class RespAPI {
    @Autowired
    private FilmService filmService;

    @Cacheable("searchQuery")
    @GetMapping("/search")
    public List<Film> searchFilms(@RequestParam(value = "searchString", required = false) String searchString) {
            return filmService.searchFilms(searchString);
    }
    @Cacheable("allFilms")
    @GetMapping(produces =
            {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public List<Film> getAllFilms() {
        System.out.println(filmService.countAll());
        return filmService.getAllFilms(Pageable.unpaged()).getContent();
    }

    @Cacheable("allFilms")
    @GetMapping(consumes = {MediaType.TEXT_PLAIN_VALUE + ";charset=UTF-8", "text/plain"}, produces =
            {MediaType.TEXT_PLAIN_VALUE + ";charset=UTF-8", "text/plain"})
    public String getAllTextFilms2() {
        System.out.println("string");
        return filmService.getAllFilms(Pageable.unpaged()).getContent().toString();
    }

    @Cacheable("allFilms")
    @GetMapping(value = "/text")
    public String getAllTextFilms() {
        System.out.println("string");
        return filmService.getAllFilms(Pageable.unpaged()).getContent().toString();
    }


    @PostMapping( consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE,
                    MediaType.TEXT_PLAIN_VALUE})
    public Film addFilm(@RequestBody Film film) {
        return filmService.add(film);
    }
    @PostMapping( consumes = MediaType.TEXT_PLAIN_VALUE+";charset=UTF-8")
    public String addFilm(@RequestBody String film) {
        Film parsedFilm = new Film();
        parsedFilm.parse(film);
        return filmService.add(parsedFilm).toString();
    }

    @PutMapping(value ="/{id}", consumes =
            {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE,
                    MediaType.TEXT_PLAIN_VALUE})
    public Film updateFilm(@PathVariable Integer id, @RequestBody Film film) {
        return filmService.update(id, film);
    }
    @PutMapping(value ="/text/{id}")
    public String updateFilm(@PathVariable Integer id, @RequestBody String film) {
        Film parsedFilm = new Film();
        parsedFilm.parse(film);
        return filmService.update(id, parsedFilm).toString();
    }


    @DeleteMapping(value = "/{id}")
    public void deleteFilm(@PathVariable Integer id) {
        filmService.delete(id);
    }
}

