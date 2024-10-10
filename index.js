import express from 'express';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('change to be seen in staging');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});