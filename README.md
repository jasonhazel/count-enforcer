# Discord Bot with Web UI

A Discord bot with a web interface for easy server management. Built mostly by [Cursor AI](https://cursor.sh) because who has time to write code manually anymore?

> **Note:** This bot is heavily influenced by existing counting bot implementations. Since this was primarily written by AI (robots), there are no copyright claims - feel free to use, modify, and distribute as you please!

## Features

- Discord bot with counting functionality
- Web UI for bot management
- Server statistics tracking
- Multi-language support
- Save system for counting mistakes

## Development with Cursor AI

Look, I'm not saying I let an AI write most of this code... but I'm also not saying I didn't. [Cursor AI](https://cursor.sh) did the heavy lifting while I mostly just:
- Watched it generate code and pretended to understand what was happening
- Fixed the occasional bug it introduced
- Added snarky comments to make it look like I was involved
- Took credit for its work

The development process was "accelerated" by Cursor AI's ability to understand my vague hand-waving and turn it into actual working code. 99.7% vibes, 0.3% actual effort.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Discord Bot Token
- Discord Application Client ID

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_application_client_id
WEB_PORT=3000  # Optional, defaults to 3000
```

The bot needs these to:
- Actually connect to Discord (DISCORD_TOKEN)
- Generate the correct invite URL (CLIENT_ID)
- Know which port to run the web UI on (WEB_PORT)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd web
   npm install
   cd ..
   ```

## Development

To run the bot and web UI in development mode:

1. Start the bot:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start the web UI:
   ```bash
   npm run web:dev
   ```

The bot will be available on Discord, and the web UI will be accessible at `http://localhost:3000`.

## Production

To build and run in production:

1. Build the web UI:
   ```bash
   npm run web:build
   ```

2. Start the application:
   ```bash
   npm start
   ```

## Docker

To run using Docker:

```bash
npm run docker:start
```

## Testing

Run the test suite:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

For coverage report:

```bash
npm run test:coverage
``` 