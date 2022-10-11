# canny-discord-auth
#### a simple flow to use [Canny](https://canny.io)'s SSO login feature with Discord oauth

## Setup
Add a `.env` file with the following values:
```shell
DISCORD_CLIENT_ID= // client ID from Discord dev portal
DISCORD_CLIENT_SECRET= // client secret, also from Discord dev portal
CANNY_PRIVATE_KEY= // SSO key from Canny
HOST= // Host (with the slash at the end). Something like "http://127.0.0.1:3000/" or "https://canny-auth.example.com/"
```

### Discord redirect URI:
/auth/finish. Something like "http://127.0.0.1:3000/auth/finish" or "https://canny-auth.example.com/auth/finish"

### Canny SSO URI:
/auth/start. Something like "http://127.0.0.1:3000/auth/start" or "https://canny-auth.example.com/auth/start"

## Actually running it
Install stuff with `npm i` or `pnpm i`

Start with `npm run start` or `pnpm start`
