# Memory Game

## Description

Memory Game is a space-themed browser game with 16 cards forming 8 matching pairs. Cards are shuffled for every new game. The interface includes Moves and matched Pairs counters, New Game functionality, a victory modal, and a Top 10 Leaderboard. Completed results are saved in `localStorage`.

The application is built with HTML, SCSS/CSS, and JavaScript, without frameworks or third-party UI libraries.

## How to Run Locally

1. Clone the repository.
2. Open the project folder.
3. Install the development dependencies:

   ```bash
   npm install
   ```

4. Compile the SCSS into CSS:

   ```bash
   npm run sass
   ```

   To watch for SCSS changes while developing, run:

   ```bash
   npm run sass:watch
   ```

5. Open `index.html` through a local development server or an IDE browser server. A local server is recommended because the application uses JavaScript modules.

## How to Play

- Open two cards per move.
- Matching cards stay open.
- Non-matching cards close automatically.
- Find all 8 pairs.
- Try to finish in as few moves as possible.
