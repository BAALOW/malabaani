const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/toggle', authMiddleware, async (req, res) => {
    try {
        const { productName } = req.body;
        const userId = req.user.id;

        const existing = await Favorite.findOne({ user: userId, productName });

        if (existing) {
            await Favorite.deleteOne({ _id: existing._id });
            return res.json({ isFavorite: false });
        } else {
            await Favorite.create({ user: userId, productName });
            return res.json({ isFavorite: true });
        }
    } catch (err) {
        console.log("ERROR =>", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ MY FAVORITES - PRODUCT XOGTA OO DHAN KU SOO CELI
router.get('/my-favorites', authMiddleware, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id });

        // ✅ EACH FAVORITE KA PRODUCT-KA XOGTIISA SOO KEEN
        const favoritesWithProducts = await Promise.all(
            favorites.map(async (fav) => {
                const product = await Product.findOne({ name: fav.productName });
                return {
                    _id: fav._id,
                    productName: fav.productName,
                    urlImage: product?.urlImage || "",
                    price: product?.price || 0,
                    category: product?.category || "",
                    createdAt: fav.createdAt,
                };
            })
        );

        res.json(favoritesWithProducts);
    } catch (err) {
        console.log("ERROR =>", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;