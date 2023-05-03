// load library multer
const multer = require(`multer`)

// config of storage
const configStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, `./menu_image`)
    },
    filename: (request, file, callback) => {
        // icun.jpg
        // format: image-tgl-icun.jpg
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})

// define function upload
const upload = multer({
    storage: configStorage,
    // file filter
    fileFilter: (request, file, callback) => {
        // define accepted extension
        const extension = [`image/jpg`, `image/png`, `image/jpeg`]
        // check the extension
        if (!extension.includes(file.mimetype)) {
            callback(null, false)

            return callback(null, `Invalid type of file`)
        }

        // filter size limit
        // define max size
        // max = 1mb
        const maxSize = (1 * 1024 * 1024)
        const fileSize = request.header[`content-length`]

        if (fileSize > maxSize) {
            // refuse upload
            callback(null, false)
            return callback(null, `File size is over`)
        }

        // accepted file upload
        callback(null, true)
    }
})

// export file

module.exports = upload