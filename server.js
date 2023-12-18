/**
 * Copyright 2022 Blecon Ltd
 * SPDX-License-Identifier: MIT
 */

'use strict';

const express = require('express');
const https = require('https');

const PORT = process.env.PORT || 3000;
const MEMFAULT_PROJECT_KEY = process.env.MEMFAULT_PROJECT_KEY;
const MEMFAULT_ORGANIZATION_NAME = process.env.MEMFAULT_ORGANIZATION_NAME;
const MEMFAULT_PROJECT_NAME = process.env.MEMFAULT_PROJECT_NAME;
const BLECON_SECRET = process.env.BLECON_SECRET;
const INDEX = '/index.html';

const server = express()
  
server.use(express.json())
  .post('/', async (req, res) => {
    if(req.get('Blecon-Secret') != BLECON_SECRET) {
      res.status(401).send('Unauthorized');
      return;
    }

    console.log("Blecon request: ", req.body);

    let device_id = req.body['network_headers']['device_id'];
    let payload = Buffer.from(req.body['request_data']['payload'], 'hex');
    await sendToMemfault(device_id, payload);
    res.json({ response_data: { payload: '00'} });
  });

// Redirect /device?device_id=... to https://app.memfault.com/organizations/<organization>/projects/<project>/devices/<uuid>
server.get('/device', (req, res) => {
  res.redirect('https://app.memfault.com/organizations/' + MEMFAULT_ORGANIZATION_NAME + '/projects/' + MEMFAULT_PROJECT_NAME + '/devices/' + req.query.device_id);
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

function sendToMemfault(device_id, payload) {
  return new Promise((resolve, reject) => {
    console.log("Chunk: ", payload);

    const req = https.request('https://chunks.memfault.com/api/v0/chunks/' + device_id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Memfault-Project-Key': MEMFAULT_PROJECT_KEY
      }
    }, res => {
      console.log("Status: " + res.statusCode);
      resolve();
    })
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}