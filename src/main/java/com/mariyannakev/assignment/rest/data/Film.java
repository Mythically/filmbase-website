package com.mariyannakev.assignment.rest.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "films")
@Setter @Getter @ToString
public class Film {
        @Id
        @GeneratedValue(generator = "increment")
        @Column
        private Integer id;
        @Column
        private String title;
        @Column
        private Integer year;
        @Column
        private String director;
        @Column
        private String stars;
        @Column
        private String review;

}
