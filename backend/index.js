const cors = require('cors');
const app = require('./server');

app.use(cors({
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});