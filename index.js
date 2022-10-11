const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const jwt = require('jsonwebtoken');
const DiscordOauth2 = require("discord-oauth2");

dotenv.config();
const oauth = new DiscordOauth2();

var app = express();
app.use(cors({ credentials: true, origin: true }));

app.get("/auth/start", (req, res, next) => {
    if (!req.query.companyID || !req.query.redirect) return res.status(400).json('bad request');
    res.redirect('https://discord.com/api/oauth2/authorize?client_id=913934717819166791&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fauth%2Ffinish&response_type=code&scope=identify%20email&prompt=none&state=https://canny.io/api/redirects/sso?companyID=' + req.query.companyID + '%26redirect%3D' + req.query.redirect)
});

app.get("/auth/finish", async (req, res, next) => {
    if (!req.query.state || !req.query.code) return res.status(400).json('bad request');
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // get token from Discord
    let tokenRes = await oauth.tokenRequest({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        code: req.query.code,
        redirectUri: process.env.HOST + "auth/finish",
        grantType: "authorization_code"
    })
    let user = await oauth.getUser(tokenRes.access_token);
    let credentials = Buffer.from(`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`).toString("base64");
    await oauth.revokeToken(tokenRes.access_token, credentials);

    let userData = {
        avatarURL: "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png",
        email: user.email,
        id: user.id,
        name: user.username
    }
    let cannyToken = jwt.sign(userData, process.env.CANNY_PRIVATE_KEY, { algorithm: 'HS256' });
    res.redirect(req.query.state + "&ssoToken=" + cannyToken)
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});