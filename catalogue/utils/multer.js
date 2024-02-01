
let multer = require("multer");

let storage = multer.diskStorage({
    destination: (re, file, cb) => {
        cb(null, 'catalogue/public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.originalname.split('.')[0]}-assertTracking.${ext}`)
    }
})

let upload = multer({ storage: storage });

module.exports = upload;
