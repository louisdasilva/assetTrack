const router = require('express').Router();
const {
    partForm, addPart, parts, delPart, part
} = require("../controller/part");
const upload = require("../utils/multer");

router.get("/", partForm);
router.post('/part', upload.single("picture"), addPart);
router.get('/part', parts);
router.get('/part/:id', part);
router.delete("/part/:id", delPart);

module.exports = router;
