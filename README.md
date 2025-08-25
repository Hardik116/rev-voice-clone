# Rev Voice Clone

A real-time conversational AI voice assistant for RatanIndia, powered by the Gemini API.  
This project enables users to interact with an AI assistant using their voice, supporting multiple languages and providing company-specific answers.

---

## Features

- 🎤 **Voice Recognition:** Speak to the assistant in English, Hindi, Tamil, and more.
- 🗣️ **Text-to-Speech:** AI answers are spoken back in the same language as the question.
- 🌐 **Company Knowledge:** Answers are generated strictly from RatanIndia's company data.
- 🔄 **Real-time Conversation:** Ask multiple questions in a row, with smooth state transitions.
- 🖥️ **Frontend Only:** Works directly in the browser (backend optional for audio uploads).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/rev-voice-clone.git
   cd rev-voice-clone
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up your Gemini API key:**
   - Create a `.env` file in the root directory:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - (Optional) If using the backend, also add:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     GEMINI_MODEL=gemini-1.5-flash
     ```

4. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **(Optional) Start the backend server:**
   ```sh
   node server.js
   ```
   > Only needed if you want to process audio uploads or hide your API key.

---

## Project Structure

```
rev-voice-clone/
├── public/
├── src/
│   ├── components/
│   │   └── VoiceChat.tsx
│   ├── companyPrompt.ts
│   └── main.tsx
├── server.js         # Optional backend for audio uploads
├── .env
├── index.html
└── README.md
```

---

## Usage

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Tap and hold the microphone button to ask a question.
- The assistant will answer using only RatanIndia company data, in the same language as your question.

---

## Customization

- **Company Data:**  
  Edit `src/companyPrompt.ts` to update your company information and prompt logic.

- **Languages:**  
  Add more languages in the language detection and TTS logic in `VoiceChat.tsx` and `companyPrompt.ts`.

---

## License

MIT

---

## Credits

- Built with [React](https://react.dev/), [Gemini API](https://ai.google.dev/), and