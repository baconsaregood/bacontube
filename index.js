const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read and write JSON data
const readData = () => {
    const filePath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ users: [], files: [] }, null, 2), 'utf8');
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeData = (data) => {
    const filePath = path.join(__dirname, 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    const data = readData();
    const file = req.file;
    const fileSize = fs.statSync(file.path).size;

    if (fileSize > 500 * 1024 * 1024) { // 500 MB
        fs.unlinkSync(file.path); // Remove file if it exceeds the limit
        return res.status(400).json({ message: 'File exceeds 500 MB limit.' });
    }

    data.files.push({
        filename: file.originalname,
        size: fileSize
    });

    writeData(data);

    res.json({ message: 'File uploaded successfully.' });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to list videos
app.get('/videos', (req, res) => {
    const data = readData();
    res.json(data.files);
});

// Run server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
