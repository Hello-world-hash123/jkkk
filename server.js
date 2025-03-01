const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));

// Configure CORS
app.use(cors({
  origin: 'https://face-detect11.netlify.app', // Allow only your frontend
  methods: ['GET', 'POST', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
  credentials: true // Enable credentials (if needed)
}));

// Handle preflight requests
app.options('*', cors()); // Enable preflight for all routes

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Upload endpoint
app.post('/upload', (req, res) => {
  const photo = req.body.photo;

  if (!photo) {
    return res.status(400).json({ error: 'No photo received.' });
  }

  if (!photo.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
  }

  const base64Data = photo.replace(/^data:image\/jpeg;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = `photo_${Date.now()}.jpg`;
  const filePath = path.join(__dirname, 'uploads', fileName);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error saving photo:', err);
      return res.status(500).json({ error: 'Failed to save photo.' });
    }

    console.log('Photo saved:', fileName);
    res.status(200).json({ 
      message: 'Photo received and saved!',
      fileName: fileName,
      url: `https://main-woad-two.vercel.app/uploads/${fileName}`
    });
  });
});

// Create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
