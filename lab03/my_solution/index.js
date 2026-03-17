import express from 'express';
import FilmLibrary from './FilmLibrary.js';
import dayjs from 'dayjs';
import Film from './Film.js';

const app = express();
const fl = new FilmLibrary();

/*
[GET] /films
Retrieve all films
[Sample request]
GET /films
[Sample response]
200 OK
[
  { id: 1, title: "Film A", rating: 5 }
]
[Error response(s)]
500 Internal Server Error
*/
app.get("/films", async (req, res) => {
    try {
        const films = await fl.getFilms();
        res.json(films);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[GET] /films/favourites
Retrieve all favorite films
[Sample request]
GET /films/favourites
[Sample response]
200 OK
[ {...} ]
[Error response(s)]
500 Internal Server Error
*/
app.get("/films/favourites", async (req, res) => {
    try {
        const favourites = await fl.getFavorites();
        res.json(favourites);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[GET] /films/mostrated
Retrieve films with highest ratings
[Sample request]
GET /films/mostrated
[Sample response]
200 OK
[ {...} ]
[Error response(s)]
500 Internal Server Error
*/
app.get("/films/mostrated", async (req, res) => {
    try {
        const mostRated = await fl.getMostRatedFilms();
        res.json(mostRated);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[GET] /films/lastmonth
Retrieve films watched in the current month
[Sample request]
GET /films/lastmonth
[Sample response]
200 OK
[ {...} ]
[Error response(s)]
500 Internal Server Error
*/
app.get("/films/lastmonth", async (req, res) => {
    try {
        const firstof = dayjs().startOf('month').format('YYYY-MM-DD');
        const endof = dayjs().endOf('month').format('YYYY-MM-DD');

        const lastMonth = await fl.getInterval(firstof, endof);
        res.json(lastMonth);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[GET] /films/unseen
Retrieve unseen films
[Sample request]
GET /films/unseen
[Sample response]
200 OK
[ {...} ]
[Error response(s)]
500 Internal Server Error
*/
app.get("/films/unseen", async (req, res) => {
    try {
        const unseen = await fl.getUnseen();
        res.json(unseen);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[GET] /films/:id
Retrieve a specific film by ID
[Sample request]
GET /films/1
[Sample response]
200 OK
{ id: 1, title: "Film A" }
[Error response(s)]
400 Bad Request
404 Not Found
500 Internal Server Error
*/
app.get("/films/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const film = await fl.getFilm(id);

        if (!film) {
            return res.status(404).json({ error: "Film not found" });
        }

        res.json(film);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[POST] /films
Create a new film
[Sample request]
POST /films
{
  "title": "Film A",
  "watchDate": "2024-03-10",
  "isFavorite": true,
  "rating": 5
}
[Sample response]
200 OK
{ id: 10 }
[Error response(s)]
400 Bad Request
500 Internal Server Error
*/
app.post("/films", express.json(), async (req, res) => {
    const { title, watchDate, isFavorite, rating } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    if (rating !== undefined && (!Number.isInteger(rating) || rating < 0 || rating > 5)) {
        return res.status(400).json({ error: "Rating must be an integer between 0 and 5" });
    }

    let parsedDate = null;
    if (watchDate) {
        if (!dayjs(watchDate, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({ error: "Invalid date format (YYYY-MM-DD)" });
        }
        parsedDate = dayjs(watchDate);
    }

    try {
        const film = new Film(
            undefined,
            title,
            parsedDate,
            isFavorite,
            rating,
            1
        );

        const id = await fl.addFilm(film);
        res.json({ id });

    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[PUT] /films/:id
Update a film
[Sample request]
PUT /films/1
{ "title": "Updated title" }
[Sample response]
204 No Content
[Error response(s)]
400 Bad Request
404 Not Found
500 Internal Server Error
*/
app.put("/films/:id", express.json(), async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        await fl.updateFilm(id, req.body);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[PUT] /films/:id/rating
Update film rating
[Sample request]
PUT /films/1/rating
{ "rating": 4 }
[Sample response]
204 No Content
[Error response(s)]
400 Bad Request
500 Internal Server Error
*/
app.put("/films/:id/rating", express.json(), async (req, res) => {
    const id = parseInt(req.params.id);
    const { rating } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ error: "Invalid rating" });
    }

    try {
        await fl.updateRating(id, rating);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[PUT] /films/:id/favorite
Update favorite status
[Sample request]
PUT /films/1/favorite
{ "isFavorite": 1 }
[Sample response]
204 No Content
[Error response(s)]
400 Bad Request
500 Internal Server Error
*/
app.put("/films/:id/favorite", express.json(), async (req, res) => {
    const id = parseInt(req.params.id);
    const { isFavorite } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (isFavorite !== 0 && isFavorite !== 1) {
        return res.status(400).json({ error: "isFavorite must be 0 or 1" });
    }   

    try {
        await fl.updateFavorite(id, isFavorite);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

/*
[DELETE] /films/:id
Delete a film
[Sample request]
DELETE /films/1
[Sample response]
204 No Content
[Error response(s)]
400 Bad Request
500 Internal Server Error
*/
app.delete("/films/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        await fl.deleteFilm(id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(3000, () => console.log('Server ready'));