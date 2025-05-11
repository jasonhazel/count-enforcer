# Discord Bot with Web UI

A Discord bot with a web interface for easy server management.

## Features

- Discord bot with counting functionality
- Web UI for bot management
- Server statistics tracking
- Multi-language support
- Save system for counting mistakes

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
PORT=3001
```

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