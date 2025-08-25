# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/283a0686-c3ce-4933-830d-5379113d8045

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/283a0686-c3ce-4933-830d-5379113d8045) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/283a0686-c3ce-4933-830d-5379113d8045) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

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

- Built with [React](https://react.dev/), [Gemini API](https://ai.google.dev/), and [Vite](https://vitejs.dev/).
- UI inspired by [Lovable](https://lovable.dev/).
