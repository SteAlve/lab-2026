import express from 'express';
import FilmLibrary from './FilmLibrary.js';
import dayjs from 'dayjs';

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

app.listen(3000, () => console.log('Server ready'));