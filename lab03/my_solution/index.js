import express from 'express';
import FilmLibrary from './FilmLibrary';

const app = express();

const fl = new FilmLibrary();

app.get("/films", (req, res) =>{

});