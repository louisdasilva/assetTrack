
const router = require('express').Router();
const {
    addPart, delPart, getAllParts, getPartById
} = require("../controllers/catalogueController");

router.get("/", getAllParts);
router.post('/part', addPart);
router.get('/part/:id', getPartById);
router.delete("/part/:id", delPart);

module.exports = router;
