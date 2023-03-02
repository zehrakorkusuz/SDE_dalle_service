const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function createNewImage(req, res) {
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
}

module.exports = { createNewImage };
