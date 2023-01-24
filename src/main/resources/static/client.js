const apiUrlBase = "http://localhost:8080/films";

$("#format-select").change(function() {
    let format = $(this).val();
    console.log("Selected format: " + format);
});
// https://github.com/robertomiranda/xml2json/blob/master/xml2json.js
// Changes XML to JSON
// XML 😡😡😡😡😡😡
function xml2json(xml) {
    // 'root' object in the comments refers to the object defined below ('obj')
    // since this function is called recursively, it may not be the actual root
    // of the linked list 😊

    // Create the return object
    let obj = {};

    if (xml.nodeType == 3) { // text
        // set field to its text value object
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        // iterate over all the children
        for (let i = 0; i < xml.childNodes.length; i++) {
            // take the item at index i
            let item = xml.childNodes.item(i);
            // store the node's name
            let nodeName = item.nodeName

            if (nodeName === "#text") {
                let val = item.nodeValue
                if (/^\d+$/.test(val) && xml.nodeName !== 'title') val = parseInt(val)
                obj = val
            }
            else if (typeof (obj[nodeName]) == "undefined") {
                // if the 'root' object does not have the current item within itself
                // we parse the item and add the field to the 'root' object
                obj[nodeName] = xml2json(item);
            } else {
                // otherwise we check whether the length of the field on the 'root' object is defined or not
                if (typeof (obj[nodeName].length) == "undefined") {
                    // if it isn't we do some linked list magic PogChamp
                    let old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                // at the end of it all we still take the item and run it through the chain of conversion.
                // then we append it to the 'root' object.
                obj[nodeName].push(xml2json(item));
            }
        }
    }
    return obj;
}

// JSON to XML

function json2xml(data) {
    let xml = new XMLSerializer().serializeToString(new DOMParser().parseFromString('<film />', 'application/xml'));
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "application/xml");

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let newElement = xmlDoc.createElement(key);
            let newText = xmlDoc.createTextNode(data[key]);
            newElement.appendChild(newText);
            xmlDoc.documentElement.appendChild(newElement);
        }
    }
    return new XMLSerializer().serializeToString(xmlDoc);
}
function text2json(data) {
    return JSON.parse(data);
}

// add comma delimiters between objects
function json2text(data) {
    if (data.id === undefined) {
        console.log(data.id + " is undefined")
        return data.title + "," + data.year + "," + data.director + "," + data.stars + "," + data.review;
    } else {
        console.log(data.id + " is defined")
        return data.id + "," + data.title + "," + data.year + "," + data.director + "," + data.stars + "," + data.review;
        }
}

function getData() {
    let format = $("#format-select").val();
    let url = apiUrlBase + "?format=" + format;
    let dataType;
    let contentType;
    let mimeType;

    switch (format) {
        case "json":
            dataType = "json";
            contentType = "application/json";
            mimeType = "application/json";
            break;
        case "xml":
            dataType = "xml";
            contentType = "application/xml";
            mimeType = "application/xml";
            break;
        case "text":
            dataType = "text";
            contentType = "text/plain";
            mimeType = "text/plain";
            break;
    }

     return $.ajax({
        url: url,
        type: "GET",
        dataType: dataType,
        contentType: contentType,
        mimeType: mimeType,
    });
}

function sendData(data, type, mapping) {
    let format = $("#format-select").val();
    console.log(format);
    let url = apiUrlBase + "?format=" + format;
    let dataType;
    let contentType;
    let mimeType;
    let acceptHeaders = {};

    switch (format) {
        case "json":
            console.log("json");
            url = apiUrlBase + mapping + "?format=" + format;
            data = JSON.stringify(data);
            dataType = "json";
            contentType = "application/json";
            mimeType = "application/json";
            acceptHeaders = {"Accept":"application/json"};
            break;
        case "xml":
            console.log("xml");
            url = apiUrlBase + mapping + "?format=" + format;
            data = json2xml(data);
            dataType = "xml";
            contentType = "application/xml";
            mimeType = "application/xml";
            acceptHeaders = {"Accept":"application/xml"};
            break;
        case "text":
            url = apiUrlBase + mapping + "?format=" + format;
            data = json2text(data);
            dataType = "text";
            contentType = "text/plain";
            mimeType = "text/plain";
            $.ajaxSettings.headers = {"Accept":"text/plain"};
            break;
    }

    return $.ajax({
        url: url,
        type: type,
        data: data,
        dataType: dataType,
        contentType: contentType,
        mimeType: mimeType,
    });
}

// function refreshTable(data) {
//     // if request format is JSON, refresh the table
//     if (data.format === "json") {
//         let json = getData()
//         $('#filmTable').bootstrapTable('refresh');
//     }
//     // if request format is XML, transform it to JSON and refresh the table
//     if (data.format === "xml") {
//         let json = $.xml2json(data);
//         $('#filmTable').bootstrapTable('load', json);
//     }
//
// }

// $(document).on('click', '.delete-btn', function() {
//     let format = $("#format-select").val();
//     let filmId = $(this).val();
//     let index = $(this).closest('tr').data('index');
//     console.log(index)
//     if (confirm("Are you sure you want to delete this film?")) {
//         $(this).closest('tr').animate({borderColor: "#7c2d2d"}, "fastest")
//             .animate({opacity: "hide"}, "fast", function() {
//                 $.ajax({
//                     url: '/films/' + filmId,
//                     type: 'DELETE',
//                     success: function() {
//                         // refresh the table
//                         $('#filmTable').bootstrapTable('remove', {
//                             field: '$index',
//                             values: [index]
//                         });
//                     }
//                 });
//             });
//     }
// });

// $(document).on('click', '.delete-btn', function() {
function deleteing(row) {
    let filmId = row.val();
    let index = row.closest('tr').data('index');
    if (confirm("Are you sure you want to delete this film?")) {
        row.closest('tr').animate({borderColor: "#ff0000"}, "fastest")
            .animate({opacity: "hide"}, "fast", function () {
                sendData({}, "DELETE", `/${filmId}`).done(function () {
                    // refresh the table
                    $('#filmTable').bootstrapTable('remove', {
                        field: '$index',
                        values: [index]
                    });
                });
            });
    }



    // if (confirm("Are you sure you want to delete this film?")) {
    //     sendData({}, "DELETE", `/${filmId}`).done(function() {
    //         $(this).closest('tr').animate({borderColor: "#7c2d2d"}, "fastest")
    //             .animate({opacity: "hide"}, "fast", function() {
    //                 // refresh the table
    //                 $('#filmTable').bootstrapTable('remove', {
    //                     field: '$index',
    //                     values: [index]
    //                 });
    //             });
    //     });
    // }
}


// .edit-btn on click
$(document).off("click").on('click', '.edit-btn', function() {
    let filmId = $(this).val();
    let filmTitle = $(this).closest('tr').find('td:nth-child(2)').text();
    let filmYear = $(this).closest('tr').find('td:nth-child(3)').text();
    let filmDirector = $(this).closest('tr').find('td:nth-child(4)').text();
    let filmStars = $(this).closest('tr').find('td:nth-child(5)').text();
    let filmReview = $(this).closest('tr').find('td:nth-child(6)').text();

    // Populate the inputs with the data from the row
    $('#editModal .modal-title').text("Edit Movie");
    $('#editModal #editAddBtn').text("Edit Movie");
    $('#title').val(filmTitle);
    $('#year').val(filmYear);
    $('#director').val(filmDirector);
    $('#stars').val(filmStars);
    $('#review').val(filmReview);
    $('#editModal').modal('show');

    $('#editForm').off("submit").submit(function (event) {
        event.preventDefault();
        let updatedFilm = {
            "id": filmId,
            "title": $('#title').val(),
            "year": $('#year').val(),
            "director": $('#director').val(),
            "stars": $('#stars').val(),
            "review": $('#review').val()
        }
        console.log(updatedFilm);

        //  check if format is text, if it is add text to url
        let format = $("#format-select").val();
        console.log(format)
        let newUrl = "";
        if (format === "text") {
            newUrl = "/text/" + filmId;
        } else {
            newUrl = "/" + filmId;
        }
        console.log(newUrl)
        sendData(updatedFilm, "PUT", newUrl).done(function () {
            $('#editModal').modal('hide');
            // refresh the table
            $('#filmTable').bootstrapTable('refresh')
        })
    });
});

// $(document).on('click', '#add-btn', function() {
$('#add-btn').off("click").click(function() {
    $('#editModal .modal-title').text("Add Film");
    $('#editModal #saveChangesBtn').text("Add Film")
    $("#editForm")[0].reset();
    $("#editModal").modal("show");

    $('#editForm').off("submit").on('submit',function(event) {
        event.preventDefault()
        let filmData = {
            title: $('#editForm #title').val(),
            year: $('#editForm #year').val(),
            director: $('#editForm #director').val(),
            stars: $('#editForm #stars').val(),
            review: $('#editForm #review').val()
        };
        sendData(filmData, "POST", "").done(function() {
            // Refresh table to display added/updated film
            $('#filmTable').bootstrapTable('refresh');
            // Hide modal
            $('#editModal').modal('hide');
        });
    });
});
// on page load call displayFilms
$(document).ready(function() {
    // Display films in table
    displayFilms();

    // // Add click event handler for "Add Movie" button
    // $('#addBtn').click(function() {
    //     // Clear form in modal
    //     $('#editForm')[0].reset();
    //     $('#editModal .modal-title').text("Add Movie");
    //     $('#editModal #saveChangesBtn').text("Add Movie")
    //     // Show modal
    //     $('#editModal').modal('show');
    // });
    //
    //
    // // Add submit event handler for form in modal
    // $('#editForm').submit(function(event) {
    //     // Prevent form submission
    //     event.preventDefault();
    //     // Get film data from form
    //     let filmData = {
    //         id: $('#editForm #id').val(),
    //         title: $('#editForm #title').val(),
    //         year: $('#editForm #year').val(),
    //         director: $('#editForm #director').val(),
    //         stars: $('#editForm #stars').val(),
    //         review: $('#editForm #review').val()
    //     };
    //
    //     // Send AJAX request to server to add or update film
    //     let url, method;
    //     if (filmData.id) {
    //         // Update existing film
    //         url = apiUrlBase + filmData.id;
    //         method = 'PUT';
    //     } else {
    //         // Add new film
    //         url = apiUrlBase;
    //         method = 'POST';
    //     }
    //     $.ajax({
    //         url: url,
    //         method: method,
    //         data: JSON.stringify(filmData),
    //         contentType: "application/json",
    //         dataType: "json",
    //         success: function() {
    //             // Refresh table to display added/updated film
    //             $('#filmTable').bootstrapTable('refresh');
    //
    //             // Hide modal
    //             $('#editModal').modal('hide');
    //         }
    //     });
    // });
});



function displayFilms() {
    getData().then(function(films) {
        console.log(films);
        $('#filmTable').bootstrapTable({
            data: films,
            columns: [{
                field: 'id',
                title: 'ID',
                sortable: true
            }, {
                field: 'title',
                title: 'Title',
                sortable: true
            }, {
                field: 'year',
                title: 'Year',
                sortable: true
            }, {
                field: 'director',
                title: 'Director',
                sortable: true
            }, {
                field: 'stars',
                title: 'Stars',
                sortable: true
            }, {
                field: 'review',
                title: 'Review',
                sortable: true
            }, {
                formatter: function(value, row, index) {
                    return '<button onclick="deleteing($(this))" class="btn btn-danger btn-sm delete-btn" value="' + row.id + '">Delete</button> ' +
                        '<button class="btn btn-primary btn-sm edit-btn" value="' + row.id + '">Edit</button>';
                }
            }],
            search: true,
            showColumns: true,
            showColumnsSearch: true,
            showRefresh: true,
            pagination: true,
            pageSize: 10,
            refresh: true,
            togglePagination: true,
            sortName: 'id',
            sortOrder: 'asc',
        })
            .on('refresh.bs.table', function() {
             getData().done(function(films) {
                 let format = $("#format-select").val();
                 if (format === "text") {
                     $('#filmTable').bootstrapTable('refreshOptions', {
                         data:JSON.parse(films)
                     })
                }
                else if (format === "xml") {
                     $('#filmTable').bootstrapTable('refreshOptions', {
                         // List has only one item which held all the film objects, which is why xml2json is used on it.
                         data: xml2json(films)["List"].item
                     })
                }
                else if (format === "json") {
                     $('#filmTable').bootstrapTable('refreshOptions', {
                         data: films
                     })
                } else {
                     console.log(films);
                     $('#filmTable').bootstrapTable('refreshOptions', {
                         data: JSON.parse(films)
                     })
                }
             });
        });
    }).fail(function(error) {
        console.error(error);
    });
}
// $('#filmTable').on('refresh.bs.table', function() {
//     getFilmsJson().done(function(films) {
//         $('#filmTable').bootstrapTable('load', films);
//     });
// });

$("#search-form").on("mouseleave", function() {
    $("#search-results").empty()
});

function togglePagination() {
    $('#filmTable').bootstrapTable('togglePagination');
}

// very nested, very ugly, very sorry, but it works
// Queries the api for films based on entered characters, problem on the backend is that
// if using numeric characters it only looks in the id and year columns, not title
// sends a query to the api with the search term 300ms after a character has been entered
// when a shown result is clicked it redirects to a IMDB search for that film
// didn't use the API since some films in the database either did not exist
// or did not have the correct data and could not be found on IMDB
// uses 3rd party API to get the poster for the film if available
// if not available, alt tag is empty since it would just display the name movie twice
$(document).ready(function() {
    let timeout;
    $("#search-input").keyup(function() {
        clearTimeout(timeout);
        let searchString = $(this).val();
        timeout = setTimeout(function() {
            if (searchString.length > 0) {
                $.ajax({
                    url: apiUrlBase + "/search",
                    data: {
                        searchString: searchString,
                        limit: 10
                    }
                }).done(function(response) {
                    let searchResults = "";
                    $.each(response, function(index, film) {
                        getFilmPoster(film.title, film.year).then(function(poster) {
                            let urlTitle = encodeURIComponent(film.title + " " + film.year);
                            searchResults += "<li><img src=" + poster+">";
                            searchResults += "<a target='_blank' href=https://www.imdb.com/find?q=" + urlTitle + ">" + film.title +  "</a></li>";
                            $("#search-results").html("<ul>" + searchResults + "</ul>").show().slideDown().fadeIn();
                        });
                    });
                });
            } else {
                $("#search-results").hide();
            }
        }, 300);
    });
});

function getFilmPoster(title, year) {
    return $.ajax({
        url: "http://www.omdbapi.com/",
        data: {
            apikey: "8f0be9e3",
            t: title,
            y: year
        }
    }).then(function(response) {
        return response.Poster;  // Return the Poster property from the response
    });
}


// better implementation above
// $(document).ready(function() {
//     // handle form submission
//     $("#search-form").submit(function(event) {
//         event.preventDefault(); // prevent the form from submitting
//         search(); // run the search function
//     });
//
//     // handle enter key press in the search input
//     $("#search-input").keypress(function(event) {
//         if (event.which === 13) {
//             event.preventDefault();
//             search();
//         }
//     });
//
//     function search() {
//         let query = $("#search-input").val();
//         $.ajax({
//             url: "http://www.omdbapi.com/",
//             data: {
//                 apikey: "8f0be9e3",
//                 s: query
//             },
//             success: function(data) {
//                 // handle the response data
//                 let html = "";
//                 if (data.Response === "True") {
//                     // get only the first result
//                     let movie = data.Search[0];
//                     html += `<div class="movie">
//                         <img src="${movie.Poster}" alt="${movie.Title}">
//                    <h2>${movie.Title}</h2>
//                    <p>Year: ${movie.Year}</p>
//                    <img src="${movie.Poster}" alt="${movie.Title} poster" />
//                  </div>`;
//                 } else {
//                     html = "<p>No results found.</p>";
//                 }
//                 $("#results").html(html);
//             }
//         });
//     }
// });

//before i could get xml to work with bootstrapTable
// function displayXml(data) {
//     // Parse the XML response
//     console.log(data)
//     let xml = data;
//     let films = $(xml).find('item');
//
//     // Create the table
//     let table = $('<table></table>');
//     table.append('<tr><th>ID</th><th>Title</th><th>Year</th><th>Director</th><th>Stars</th><th>Review</th><th>Edit</th><th>Delete</th></tr>');
//
//     // Add rows to the table
//     films.each(function() {
//         let film = $(this);
//         let id = film.find('id').text();
//         let title = film.find('title').text();
//         let year = film.find('year').text();
//         let director = film.find('director').text();
//         let stars = film.find('stars').text();
//         let review = film.find('review').text();
//         table.append('<tr><td>' + id + '</td><td>' + title + '</td><td>' + year + '</td><td>' + director + '</td><td>' + stars + '</td><td>' + review + '</td><td><button class="edit-button">Edit</button></td><td><button class="delete-button">Delete</button></td></tr>');
//     });
//
//     // Add the table to the page
//     $('.film-table').append(table);
// }
// $(document).on('click', '.edit-button', function() {
//     // Get the row that contains the button that was clicked
//     let row = $(this).closest('tr');
//
//     // Get the values from the cells in the row
//     let id = row.find('td:nth-child(1)').text();
//     let title = row.find('td:nth-child(2)').text();
//     let year = row.find('td:nth-child(3)').text();
//     let director = row.find('td:nth-child(4)').text();
//     let stars = row.find('td:nth-child(5)').text();
//     let review = row.find('td:nth-child(6)').text();
//
//     // Update the film database using the values from the cells
//     $('#editModal').modal('show');
//     $('#title').val(title);
//     $('#year').val(year);
//     $('#director').val(director);
//     $('#stars').val(stars);
//     $('#review').val(review);
//
//     $('#saveChangesBtn').on('click').click(function() {
//         let updatedFilm = JSON.stringify({
//             "id": id,
//             "title": $('#title').val(),
//             "year": $('#year').val(),
//             "director": $('#director').val(),
//             "stars": $('#stars').val(),
//             "review": $('#review').val()
//         });
//         console.log(updatedFilm);
//
//         $.ajax({
//             url: apiUrlBase + "/" + id,
//             type: 'PUT',
//             data: updatedFilm,
//             contentType: "application/json",
//             dataType: "json",
//             accept: "/",
//             mimeType: "/",
//             success: function () {
//                 $('#editModal').modal('hide');
//                 // refresh the table
//                 $('#filmTable').bootstrapTable('refresh');
//             }
//         }).then(getData);
//     });
// });