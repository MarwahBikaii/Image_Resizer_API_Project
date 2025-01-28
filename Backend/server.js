const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('uploads'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/resize', upload.single('image'), async (req, res) => {
    const { width, height } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const resizedImageBuffer = await sharp(req.file.buffer)
            .resize(parseInt(width), parseInt(height))
            .toBuffer();

        res.set('Content-Type', 'image/png');
        res.send(resizedImageBuffer);
    } catch (error) {
        res.status(500).send('Error resizing image.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});