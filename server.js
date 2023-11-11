const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'Frontend' directory
app.use(express.static(path.join(__dirname, 'Frontend')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Route for Home Page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/index.html'));
  });
  
  // Add routes for other HTML pages
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/login.html'));
  });
  
  app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/confirmation.html'));
  });
  
  app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/map.html'));
  });
  
  app.get('/provider', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/provider.html'));
  });
  
  app.get('/request', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/request.html'));
  });
  
  app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/templates/pages/services.html'));
  });

  app.use((req, res) => {
    res.status(404).send('404: Page not found');
  });
  