const express = require("express");
const router = express.Router();
const PowerUpdate = require("../Models/PowerUpdate");
const verifyAdmin = require("../Middlewares/verifyAdmin");

// Create a new update
router.post("/", verifyAdmin, async (req, res) => {
    try {
        const update = new PowerUpdate(req.body);
        await update.save();
        res.status(201).json(update);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all updates (latest first)
router.get("/", async (req, res) => {
    try {
        const updates = await PowerUpdate.find().sort({ createdAt: -1 });
        res.json(updates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
