const express = require('express')
const multer = require('multer');
const uploadFile = require('../service/storage.service');
const songmodel = require("../models/song.model");
const { route } = require('../app');

const router = express.Router();


const upload = multer({storage: multer.memoryStorage()});

router.post('/songs',upload.single('audio'), async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const fileData = await uploadFile(req.file);
    
    const song = await songmodel.create({
        title: req.body.title,
        artist: req.body.artist,
        audio: fileData.url,
        mood: req.body.mood
    })
    res.status(201).json({
        message: "Song added successfully",
        song: song
    })
})

router.post('/songs/mood', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    // Simulate mood detection using Gemini API
    const moods = ["Happy", "Sad", "Angry", "Neutral", "Calm"];
    const detectedMood = moods[Math.floor(Math.random() * moods.length)]; // Placeholder for Gemini API mood detection

    res.status(200).json({
        message: "Mood detected successfully",
        mood: detectedMood
    });
});

router.get('/songs', async (req,res) => {
    const {mood} = req.query;

    const songs = await songmodel.find({
        mood: mood
    })

    res.status(200).json({
        message:"Songs fetched successfully!",
        songs
    })
})







module.exports = router;