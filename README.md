# Hyperbolic AI Prompter

**Hyperbolic AI Prompter** is a server-side application that leverages Hyperbolic's API for generating text, speech, and images. This project provides endpoints to create content using OpenAI-powered models for text generation, text-to-speech (TTS), and image generation with support for ControlNet and LoRA models.

## Features

- **Text Generation**: Users can input a prompt, and the system will generate a text response using a selected AI model.
- **Image Generation**: Users can input a description to generate an image based on that description with support for ControlNet and LoRA models.
- **Text-to-Speech (TTS)**: Users can input text and receive a generated audio file (such as a voice reading the text).
- **Responsive Design**: The UI adapts seamlessly to both desktop and mobile devices for an optimal user experience.

## Technologies Used

- **Frontend**:
  - React (for building the user interface)
  - Tailwind CSS (for styling)
- **Backend**:
  - Node.js (for API handling and text generation)
  - Express.js (for routing)
  - Body-parser (for handling JSON requests)
  - Image generation API (Using hyperbolic API)
  - Audio generation API (Using hyperbolic API)

## Getting Started

### Prerequisites

To run this project, you will need the following installed on your system:

- **Node.js** (version >= 14.x)
- **npm** or **yarn** (for package management)
- **Git** (to clone the repository)
- A code editor (e.g., Visual Studio Code)

### 1. Clone the repository

Start by cloning the project repository to your local machine:

```bash
git clone https://github.com/AustinChris1/hyperbolic-ai-prompter.git
cd hyperbolic-ai-prompter
```
### 2. Install dependencies
Install the required dependencies using npm:

```bash
pnpm install
```

### 3. Set up environment variables
Create a .env file in the root directory of the project and add your Hyperbolic API key:

```bash
HYPERBOLIC_API_KEY=your_hyperbolic_api_key
```
You can obtain your API key from the Hyperbolic platform (https://hyperbolic.xyz).

### 4. Run the application
 - Start the server:

```bash
cd backend
pnpm install
node server.js
```
It should run on port 5000

 - Start the client
 ```bash
 pnpm run dev
 ```

# Hosted on Internet Computer (ICP) and Vercel
- You can access it from the url: https://33mye-ciaaa-aaaaj-azwta-cai.icp0.io/
