const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // <-- Add this line
require('dotenv').config();

const app = express();
app.use(cors()); // <-- Add this line
const upload = multer({ dest: 'uploads/' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-native-audio-dialog';

app.post('/api/voice', upload.single('audio'), async (req, res) => {
  try {
    console.log('Received audio file:', req.file, 'size:', req.file.size);

    const audioPath = req.file.path;
    const audioBuffer = fs.readFileSync(audioPath);
    const base64Audio = audioBuffer.toString('base64');

    // Gemini expects base64-encoded audio in the request
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              { text: "You are Rev, the official assistant for Revolt Motors. Only answer questions related to Revolt Motors, its products, services, and mission. Politely refuse to answer anything else." }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inline_data: {
                    mime_type: 'audio/wav',
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    // Clean up uploaded file
    fs.unlinkSync(audioPath);

    // Parse Gemini response (adjust as needed)
    const transcript =
      data?.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text || '';
    const response =
      data?.candidates?.[0]?.content?.parts?.find((p) => p.text && p.text !== transcript)?.text ||
      'No response from Gemini.';

    res.json({ transcript, response });
  } catch (err) {
    res.status(500).send('Error processing audio: ' + err.message);
  }
});

app.listen(3001, () => {
  console.log('Backend listening on port 3001');
});