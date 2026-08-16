const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const MOCK_PRODUCTS = [
    // Shoes (6)
    { id: '1', name: 'RaceDay Featherlight', price: 9999, category: 'running shoes', brand: 'Nike', rating: 4.8 },
    { id: '2', name: 'Ultra Boost 23', price: 12900, category: 'running shoes', brand: 'Adidas', rating: 4.5 },
    { id: '3', name: 'SpeedCross 5', price: 8500, category: 'running shoes', brand: 'Salomon', rating: 4.2 },
    { id: '4', name: 'Air Zoom Pegasus 40', price: 10495, category: 'running shoes', brand: 'Nike', rating: 4.6 },
    { id: '5', name: 'Gel-Kayano 30', price: 14999, category: 'running shoes', brand: 'ASICS', rating: 4.7 },
    { id: '6', name: 'Cloudmonster', price: 15999, category: 'running shoes', brand: 'On', rating: 4.4 },

    // Mobiles (6)
    { id: '7', name: 'iPhone 15 Pro', price: 135000, category: 'mobiles', brand: 'Apple', rating: 4.9 },
    { id: '8', name: 'Galaxy S24 Ultra', price: 125000, category: 'mobiles', brand: 'Samsung', rating: 4.7 },
    { id: '9', name: 'Pixel 8 Pro', price: 106999, category: 'mobiles', brand: 'Google', rating: 4.6 },
    { id: '10', name: 'OnePlus 12', price: 64999, category: 'mobiles', brand: 'OnePlus', rating: 4.5 },
    { id: '11', name: 'iPhone 14', price: 69900, category: 'mobiles', brand: 'Apple', rating: 4.8 },
    { id: '12', name: 'Nothing Phone (2)', price: 44999, category: 'mobiles', brand: 'Nothing', rating: 4.3 },

    // Watches (6)
    { id: '13', name: 'Apple Watch Series 9', price: 41900, category: 'watches', brand: 'Apple', rating: 4.8 },
    { id: '14', name: 'Galaxy Watch 6 Classic', price: 36999, category: 'watches', brand: 'Samsung', rating: 4.5 },
    { id: '15', name: 'Garmin Fenix 7 Pro', price: 67990, category: 'watches', brand: 'Garmin', rating: 4.7 },
    { id: '16', name: 'G-Shock Mudmaster', price: 62995, category: 'watches', brand: 'Casio', rating: 4.6 },
    { id: '17', name: 'Pixel Watch 2', price: 39900, category: 'watches', brand: 'Google', rating: 4.2 },
    { id: '18', name: 'Tissot PRX Powermatic', price: 58500, category: 'watches', brand: 'Tissot', rating: 4.9 },

    // Laptops (6)
    { id: '19', name: 'MacBook Pro 14" M3', price: 169900, category: 'laptops', brand: 'Apple', rating: 4.9 },
    { id: '20', name: 'Dell XPS 15', price: 184990, category: 'laptops', brand: 'Dell', rating: 4.7 },
    { id: '21', name: 'ThinkPad X1 Carbon', price: 145000, category: 'laptops', brand: 'Lenovo', rating: 4.6 },
    { id: '22', name: 'ROG Zephyrus G14', price: 134990, category: 'laptops', brand: 'ASUS', rating: 4.8 },
    { id: '23', name: 'Surface Laptop 5', price: 95999, category: 'laptops', brand: 'Microsoft', rating: 4.3 },
    { id: '24', name: 'MacBook Air M2', price: 99900, category: 'laptops', brand: 'Apple', rating: 4.8 }
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
app.get('/api/products', (req, res) => {
    let results = MOCK_PRODUCTS;
    if (req.query.category) {
        const term = req.query.category.toLowerCase();
        results = results.filter(p => p.category && p.category.toLowerCase() === term);
    }
    res.json({ results });
});
app.post('/api/search', (req, res) => {
    const query = (req.body.query || '').toLowerCase();
    let results = MOCK_PRODUCTS;
    if (query) {
        results = MOCK_PRODUCTS.filter(p => {
            const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();
            // Extract price if query has "under XXXX"
            const maxPrice = query.match(/under\s*₹?(\d+)|<\s*(\d+)/i);
            let priceCondition = true;
            if (maxPrice) {
                const val = parseInt(maxPrice[1] || maxPrice[2], 10);
                if (p.price > val) priceCondition = false;
            }

            const keywords = query.replace(/under\s*₹?\d+/ig, '').trim().split(' ').filter(w => w.length > 2);
            const categoryMatch = keywords.length === 0 || keywords.some(kw => text.includes(kw));

            return priceCondition && categoryMatch;
        });
    }
    res.json({ query, results });
});
app.post('/api/recommend', (req, res) => res.json({ results: MOCK_PRODUCTS }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
