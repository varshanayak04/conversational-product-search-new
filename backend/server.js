const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const MOCK_PRODUCTS = [
    { id: '1', name: 'RaceDay Featherlight', price: 9999, category: 'running shoes', brand: 'Nike', rating: 4.8 },
    { id: '2', name: 'Ultra Boost 23', price: 12900, category: 'running shoes', brand: 'Adidas', rating: 4.5 },
    { id: '3', name: 'SpeedCross 5', price: 8500, category: 'running shoes', brand: 'Salomon', rating: 4.2 },
    { id: '4', name: 'iPhone 15 Pro', price: 135000, category: 'mobiles', brand: 'Apple', rating: 4.9 },
    { id: '5', name: 'Galaxy S24 Ultra', price: 125000, category: 'mobiles', brand: 'Samsung', rating: 4.7 }
];

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/categories', (req, res) => res.json({
    categories: [
        { key: 'running shoes', label: 'Shoes' },
        { key: 'mobiles', label: 'Mobiles' },
        { key: 'watches', label: 'Watches' },
        { key: 'laptops', label: 'Laptops' }
    ]
}));
app.get('/api/trending', (req, res) => res.json({ results: MOCK_PRODUCTS }));
app.get('/api/products', (req, res) => res.json({ results: MOCK_PRODUCTS }));
app.post('/api/search', (req, res) => res.json({ query: req.body.query, results: MOCK_PRODUCTS }));
app.post('/api/recommend', (req, res) => res.json({ results: MOCK_PRODUCTS }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
