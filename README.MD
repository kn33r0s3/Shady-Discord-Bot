# NotABot — Discord Bot

NotABot is a prefix-command Discord bot built with Node.js and discord.js 12. It groups moderation, server utilities, fun commands, a Tic-Tac-Toe game, and voice-channel music controls.

The command prefix is `; ` without the space: commands start with `;` (for example, `;ping`).

## Features

- **Moderation:** kick, ban, mute, unmute, purge messages, and manage user warnings.
- **Server utilities:** show user and server information.
- **Fun and community commands:** avatars, memes, polls, random choices, roasts, Urban Dictionary lookups, Spotify activity details, and YouTube search.
- **Game:** two-player Tic-Tac-Toe.
- **Music:** play a YouTube result, view the queue, skip, loop, pause, resume, jump, remove tracks, and leave a voice channel.
- **Status:** periodically changes the bot's activity text.

## Commands

All commands use the `;` prefix.

| Area | Commands |
|---|---|
| General | `;help`, `;ping`, `;invite` |
| Moderation | `;kick @user`, `;ban @user`, `;mute @user`, `;unmute @user`, `;purge <count>`, `;warn @user -r <reason>`, `;warns @user`, `;clear-warns @user` |
| Server and user info | `;userinfo [@user]`, `;serverinfo` |
| Fun | `;av [@user]`, `;meme`, `;nude` (NSFW channels only), `;poll <question>`, `;choose <option 1, option 2>`, `;roast @user`, `;youtube <search>`, `;spotify [@user]`, `;urban <term>`, `;corona <country>`, `;say <text>` |
| Game | `;ttt @user` |
| Music | `;play <song name or URL>`, `;queue`, `;skip`, `;loop`, `;pause`, `;resume`, `;np`, `;jump <number>`, `;remove <number>`, `;leave` |

The command router contains additional aliases. Some command help text is maintained separately in `botSettings.js`, so this table follows the command cases in `runcommands.js`.

## Requirements

The repository currently declares Node.js `11.x` and npm `6.x` in `package.json`, and depends on discord.js `12.5.3`. These are legacy versions. Compatibility with current Node.js and Discord API behaviour has not been verified.

## Configuration

Create a local `.env` file in the project root. Do not commit it.

The current source reads these environment variable names:

| Variable | Used for |
|---|---|
| `CLIENT_TOKEN` | Discord bot login |
| `CLIENT_ID` | Bot ID checks in permission and music-reaction logic |
| `YT_API` | YouTube lookup used by the music module |
| `API_XD` | YouTube search command |

Example format (replace placeholders locally; never put real values in this file or in Git):

```dotenv
CLIENT_TOKEN=replace_with_a_new_discord_bot_token
CLIENT_ID=your_discord_bot_id
YT_API=your_youtube_api_key
API_XD=your_youtube_api_key_for_search
```

The two YouTube variable names are read by different modules. Confirm the required API access and key restrictions in Google Cloud. Do not assume one key is configured correctly for both paths.

If a credential was previously committed, treat it as exposed. Removing `.env` from the current branch does not remove it from earlier Git history or revoke it. Rotate exposed credentials before running the bot.

## Install and run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local `.env` file as described above.

3. Start the entry point directly:

   ```bash
   node index.js
   ```

The repository's `Procfile` also starts `node ./index.js`.

**Known start-script issue:** `package.json` currently sets `npm start` to `node run.js`, but there is no `run.js` file in the repository. Therefore, `npm start` is not a verified working start command.

## Data storage

Warning records are read from and written to the local `warns.json` file. This project does not currently show a database-backed storage layer for warnings.

## Project status and limitations

This is a legacy project, not a currently verified production-ready Discord bot.

- No test script is defined in `package.json`.
- The code uses discord.js v12 APIs and the legacy message event.
- The package start script points to a missing file.
- The help catalogue in `botSettings.js` is separate from the command router and may not list every routed command.
- Current Discord API compatibility, permissions, voice playback, and third-party API integrations have not been tested as part of this README update.
- Some commands rely on external services and API keys. Their availability may change.

These limitations are documented rather than presented as working features without test evidence.

## License

The repository includes an MIT License in `LICENSE`. The `package.json` license field currently says `ISC`; that metadata mismatch should be corrected in a separate maintenance change.
