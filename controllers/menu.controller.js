const menuModel = require(`../models/index`).menu
const joi = require(`joi`)
const { Op } = require("sequelize")
const { request, response } = require("../routes/meja.route")

// load upload function 
const upload = require(`./upload-menu`)

// create function to validate data menu
const validateMenu = (input) => {
    // define rules of menu
    let rules = joi.object().keys({
        nama_menu: joi.string().required(),
        harga: joi.number().required(),
        jenis: joi.string().valid('makanan', 'minuman').required(),
        deskripsi: joi.string().required()
    })

    // get error of validation
    let { error } = rules.validate(input)
    if (error) {
        let message = error.details.map(item => item.message).join(`,`)

        return {
            status: false,
            message: message
        }
    }

    return {
        status: true
    }
}

// load path and fs library
const path = require(`path`)
const fs = require(`fs`)

// create and export funct to get all menu
exports.addMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {

            // Check error when upload
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }

            // Check existing file
            if (!request.file) {
                return response.json({
                    status: false,
                    message: `Nothing file to upload :(`
                })
            }

            // check validation of input
            let resultValidation = validateMenu(request.body)
            if (resultValidation.status == false) {
                return response.json({
                    status: false,
                    message: resultValidation.message
                })
            }

            // slipping filename in request.body
            request.body.gambar = request.file.filename

            // insert menu using model
            await menuModel.create(request.body)

            // give a response
            return response.json({
                status: true,
                message: `Data menu telah ditambahkan`
            })
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and export func to get all menu
exports.getMenu = async (request, response) => {
    try {
        // get all menu using model
        let result = await menuModel.findAll()

        // give a response
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and exports funct to find menu
exports.findMenu = async (request, response) => {
    try {
        let keyword = request.body.keyword

        let result = await menuModel.findAll({
            where: {
                [Op.or]: {
                    nama_menu: { [Op.substring]: keyword },
                    deskripsi: { [Op.substring]: keyword },
                    jenis: { [Op.substring]: keyword }
                }
            }
        })

        // give a response
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.updateMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }
            // get id_menu that will be update
            let id_menu = request.params.id_menu

            // grab menu based on selected id menu
            let selectedMenu = await menuModel.findOne({
                where: { id_menu: id_menu }
            })


            // check if update whitin upload `gambar`
            if (request.file) {
                let oldFilename = selectedMenu.gambar
                // create path of file
                let pathFile = path.join(__dirname, `../menu_image`, oldFilename)

                // check the existing old file
                if (fs.existsSync(pathFile)) {
                    // delete the old file
                    fs.unlinkSync(pathFile, error => {
                        console.log(error)
                    })
                }

                // insert the filename to request
                request.body.gambar = request.file.filename
            }

            await menuModel.update(
                request.body,
                { where: { id_menu: id_menu } }
            )

            // give a response
            return response.json({
                status: true,
                message: `Data menu berhasil di-update`
            })
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteMenu = async (request, response) => {
    try {
        // get id will be delete
        let id_menu = request.params.id_menu
        // grab menu based on selected id
        let selectedMenu = await menuModel.findOne({
            where: { id_menu: id_menu }
        })

        // define a path of file
        let pathFile = path.join(__dirname, `../menu_image`, selectedMenu.gambar)

        // check existing file
        if (fs.existsSync(pathFile)) {
            // delete file
            fs.unlinkSync(pathFile, error => {
                console.log(error);
            })
        }

        // delete menu using model
        await menuModel.destroy({
            where: { id_menu: id_menu }
        })

        // give a response
        return response.json({
            status: true,
            message: `Data menu telah dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}