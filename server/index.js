import express from 'express'
import cors from 'cors'
import {createClient} from 'redis'
import { encoder } from './services/base_62_encoding_service.js';

const app = express();

app.use(cors());

app.use(express.json());

//initialise redis server
const redisClient = createClient ({
    url: "redis://localhost:6379"
});

redisClient.on ('connect', () => {
    console.log("redis connected")
});

redisClient.on('error', () => {
    console.log("redis conenction failed")
});


// "ask" what kind of fucntion is this?
(async() => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.log(error)
    }
})();


// shorten a url (u post a long url and get a shorter one)
app.post('/shorten', async(req,res) => {
    const {originalURL} = req.body;

    if(!originalURL) {
        res.json({
            status : false,
            error: "Please pass the long URL"
        })
    }

    try {
       const id = await redisClient.incr('global_counter');
       console.log(id);

       const shortUrlId = encoder(id);
       console.log(shortUrlId)

       await redisClient.hSet('urls', shortUrlId, originalURL);

       res.json({
        status: true,
        data: "http://yayay.com/" + shortUrlId
       });

    } catch (error) {
        console.log(error)
        res.json({
            status: false,
            error: error,
        });
    }
})
  
//get a long url from short url 
app.get('/:shortUrlId', async(req,res) => {
    const shortUrlId = req.params.shortUrlId
    const originalURL = await redisClient.hGet('urls', shortUrlId)

    res.json({
        "status" : true,
        "data" : originalURL
    })
})

app.listen(3001, () => {
    console.log("backend running")
})