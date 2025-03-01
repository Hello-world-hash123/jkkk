const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to receive the photo
app.post('/upload', (req, res) => {
    const photo = req.body.photo; // Base64-encoded photo
    if (!photo) {
        return res.status(400).send('No photo received.');
    }

    // Convert Base64 to a file
    const base64Data = photo.replace(/^data:image\/jpeg;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Save the photo to a file
    const fileName = `photo_${Date.now()}.jpg`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Error saving photo:', err);
            return res.status(500).send('Failed to save photo.');
        }

        console.log('Photo saved:', fileName);
        res.status(200).send('Photo received and saved!');
    });
});

// Create the "uploads" folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});