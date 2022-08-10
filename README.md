# Memfault Integration

A simple node.js server that acts as a request handler for Blecon and forwards chunks to the Memfault API.

Make sure to set the relevant environment variables:
* BLECON_SECRET: Authentication secret set as a header in Blecon requests
* MEMFAULT_PROJECT_KEY: Your Memfault project key

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/blecon/blecon-memfault-integration)

## Run with Heroku
```bash
heroku create blecon-memfault-integration
heroku config:set MEMFAULT_PROJECT_KEY=xxx
heroku config:set BLECON_SECRET=xxx
```

## Run locally with ngrok
```bash
npm install
export MEMFAULT_PROJECT_KEY=xxx
export BLECON_SECRET=xxx
npm start
```

In another terminal:
```bash
ngrok http 3000
```

Use the public endpoint displayed by ngrok as your Blecon request handler.