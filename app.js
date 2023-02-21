const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors());

// log the requets I get
function requestLogger(req, res, next) {
  console.log(`requested ${req.method} ${req.url}`);
  next();
}
app.use(requestLogger);

// basic api to tell that we're online
app.get("/", (req, res) => {
  res.send({ online: true });
});

// Set up the DALL-E endpoint
app.post("/image", async (req, res) => {
  // general error handling
  try {
    // Get the prompt from the request
    const { prompt } = req.body;

    // no body given
    if (prompt == null) {
      return res
        .status(400)
        .send({ error: "Give us a body with field 'prompt'" });
    }

    // Generate image from prompt
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    // Send back image url
    res.send({
      success: true,
      url: response.data.data[0].url,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
