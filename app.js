const express = require('express');
const bodyParser = require('body-parser');
const tokenService = require('./jwt');
const redisClient = require('./redis')

const app = express();

app.listen(8000, '0.0.0.0', () => { console.log(`jwt-redis Server Now Listening on port 8000`) });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/createToken', async (req, res) => {
  try {
    const result = tokenService.createJWT();

    await redisClient.hSet('tokens', `RefreshToken:${req.body.userID}`, result.refreshToken);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.post('/getToken', async (req, res) => {
  try {
    let result = await tokenService.verifyToken(req.headers.authorization);

    if(!result) {
      console.log("accessToken Expired");
 
      result = await tokenService.verifyToken(await redisClient.hGet('tokens', `RefreshToken:${req.body.userID}`));

      if(!result) {
        console.log("refreshToken Expired");

        throw Error("Token Expired Error");
      }

      result = tokenService.createJWT();
    }

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

app.get('/getList', async (req, res, next) => {
  try {
    const result = await redisClient.hGetAll('tokens');

    res.json(result)
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});