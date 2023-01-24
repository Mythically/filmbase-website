package com.mariyannakev.assignment.rest.data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "films")
@Setter @Getter
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

        @Override
        public String toString() {
                StringBuilder sb = new StringBuilder();
                sb.append("{");
                sb.append("\"id\":").append(this.id).append(",");
                sb.append("\"title\":\"").append(this.title).append("\",");
                sb.append("\"year\":").append(this.year).append(",");
                sb.append("\"director\":\"").append(this.director).append("\",");
                sb.append("\"stars\":\"").append(this.stars).append("\",");
                sb.append("\"review\":\"").append(this.review).append("\"");
                sb.append("}");
                return sb.toString();
        }
        public void parse(String plainText) {
                System.out.println(plainText);
                String[] fields = plainText.split(",");
                if(fields[0] != null && !fields[0].isBlank()){
                        try {
                                this.id = Integer.parseInt(fields[0]);
                                this.title = fields[1];
                                this.year = Integer.parseInt(fields[2]);
                                this.director = fields[3];
                                this.stars = fields[4];
                                this.review = fields[5];
                        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                                this.id = null;
                                this.title = fields[0];
                                this.year = Integer.parseInt(fields[1]);
                                this.director = fields[2];
                                this.stars = fields[3];
                                this.review = fields[4];
                        }
                }


        }
}
