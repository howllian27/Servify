import express from 'express';
import path from 'path';

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


//   app.use(bodyParser.json());

// Send an email using EmailJS
// app.post('/api/send-email', async (req, res) => {
//   try {
//     const emailResponse = await sendEmail(req.body);
//     res.json({ message: 'Email sent successfully', response: emailResponse });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Fetch data from Firebase
// Example route to fetch data from Firebase
// app.get('/api/data', (req, res) => {
//     const ref = db.ref('your-data-path');
//     ref.once('value', (snapshot) => {
//       res.json(snapshot.val());
//     }, (error) => {
//       res.status(500).json({ error: error.message });
//     });
//   });
  
//   // Example route to post data to Firebase
//   app.post('/api/data', (req, res) => {
//     const ref = db.ref('your-data-path');
//     ref.push(req.body, (error) => {
//       if (error) {
//         res.status(500).json({ error: error.message });
//       } else {
//         res.json({ message: 'Data saved successfully' });
//       }
//     });
//   });