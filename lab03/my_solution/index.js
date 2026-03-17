import express from 'express';
import FilmLibrary from './FilmLibrary.js';
import dayjs from 'dayjs';
import Film from './Film.js';

const app = express();

const fl = new FilmLibrary();

app.get("/films", async(req, res) =>{
    const films = await fl.getFilms();
    res.json(films);
});

app.get("/films/favourites", async(req, res) => {
    const favourites = await fl.getFavorites();
    res.json(favourites);
});

app.get("/films/mostrated", async(req, res) => {
    const mostRated = await fl.getMostRatedFilms();
    res.json(mostRated);
});

app.get("/films/lastmonth", async(req, res) => {
    const firstof = dayjs().startOf('month').format('YYYY-MM-DD');
    const endof = dayjs().endOf('month').format('YYYY-MM-DD');
    const lastMonth = await fl.getInterval(firstof, endof);
    res.json(lastMonth);
});

app.get("/films/unseen", async(req, res) => {
    const unseen = await fl.getUnseen();
    res.json(unseen);
});

app.get("/films/:id", async(req, res) => {
    const film = await fl.getFilm(req.params.id);
    res.json(film);
});

app.post("/films",express.json(), async (req, res) => {
    try {
        const film = new Film(
            undefined,
            req.body.title,
            req.body.watchDate ? dayjs(req.body.watchDate) : null,
            req.body.isFavorite,
            req.body.rating,
            req.body.user_id
        );

        const id = await fl.addFilm(film);
        res.json(id);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.put("/films/:id", express.json(), async (req, res) => {
    try{
        const film = new Film(
            req.params.id,
            req.body.title,
            req.body.watchDate ? dayjs(req.body.watchDate) : null,
            req.body.isFavorite,
            req.body.rating,
            req.body.user_id
        );
        await fl.updateFilm(film);
        res.end();
    } catch (err) {
        res.status(500).json(err);
    } 
});

app.listen(3000, () => console.log('Server ready'));