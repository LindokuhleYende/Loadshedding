const express = require("express");
const axios = require("axios");
const router = express.Router();

// Area info by ID (already done earlier)
router.get("/area", async (req, res) => {
    const { id } = req.query;
    try {
        const response = await axios.get(
            `https://developer.sepush.co.za/business/2.0/area?id=${id}`,
            {
                headers: {
                    Token: process.env.ESKOM_API_KEY,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch area info" });
    }
});

// 🔍 New route: Search by area name
router.get("/search", async (req, res) => {
    const { text } = req.query;

    if (!text) return res.status(400).json({ error: "Missing 'text' parameter" });

    try {
        const response = await axios.get(
            `https://developer.sepush.co.za/business/2.0/areas_search?text=${encodeURIComponent(text)}`,
            {
                headers: {
                    Token: process.env.ESKOM_API_KEY,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Search error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to search area" });
    }
});

module.exports = router;
