const express = require('express');
const app = express();
const path = require('path');

// Serve files from public directory
app.use(express.static('public'));
// Serve files from root directory
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});