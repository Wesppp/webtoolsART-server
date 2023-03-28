const multer = require('multer');
const DIR = './server/uploads/'

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, DIR) },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname) 
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('You can upload only image files!', false))
    }

    cb(null, true)
}

const upload = multer({storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter})

module.exports = upload