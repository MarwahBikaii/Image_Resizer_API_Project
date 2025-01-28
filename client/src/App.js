import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styling

function App() {
    const [image, setImage] = useState(null);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const downloadImage = (blob, filename) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleResize = async () => {
        if (!image) {
            alert('Please upload an image.');
            return;
        }
        if (!width || !height) {
            alert('Please enter both width and height.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('width', width);
        formData.append('height', height);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/resize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Important for downloading the image
            });

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'image/png' });
            downloadImage(blob, 'resized-image.png'); // Automatically download the resized image
        } catch (error) {
            alert('Error resizing image: ' + (error.response ? error.response.data : error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Image Resizer</h1>
            <input type="file" onChange={handleImageChange} />
            <input
                type="number"
                placeholder="Width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
            />
            <input
                type="number"
                placeholder="Height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
            />
            <button onClick={handleResize} disabled={loading}>
                {loading ? 'Resizing...' : 'Resize Image'}
            </button>
        </div>
    );
}

export default App;