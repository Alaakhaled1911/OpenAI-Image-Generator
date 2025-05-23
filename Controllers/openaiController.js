const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

// Generate image controller
const generateImage = async (req, res) => {
  // Get prompt from request body
  const { prompt, size } = req.body;
  const imageSize =
    size === "portrait"
      ? "1024x1792"
      : size === "landscape"
      ? "1792x1024"
      : "1024x1024"; // Default to square if invalid size

  try {
    // Generate image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: imageSize,
    });

    // Get image URL
    const imageUrl = response.data[0].url;

    // Return success response
    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    console.error("Error:", error);

    // Return error response
    res.status(500).json({
      success: false,
      error:
        error.response?.data?.error?.message ||
        "The image could not be generated",
    });
  }
};

module.exports = { generateImage };
