const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Mock database for link clicks
const linkClicks = {};

app.get('/link-clicked/:token', (req, res) => {
    const token = req.params.token;
    linkClicks[token] = true;
    res.send('Link clicked registered.');
});

app.get('/check-link-clicked/:token', (req, res) => {
    const token = req.params.token;
    res.json({ linkClicked: !!linkClicks[token] });
});
