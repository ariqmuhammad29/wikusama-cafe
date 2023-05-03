// load model of user
const modelUser = require(`../models/index`).user

// load joi library
const joi = require(`joi`)

const {Op} = require(`sequelize`)
const { response, request } = require("../routes/meja.route")

const md5 = require(`md5`)

// create a validation func
let validateUser = async (input) => {
    // make a rules of validation
    let rules = joi.object().keys({
        nama_user: joi.string().required(),
        role: joi.string().validate(`kasir`, `admin`, `manager`),
        username: joi.string().required(),
        password: joi.string().min(3)
    })

    // process validation
    let { error } = rules.validate(input)
    
    // check error validation
    if (error) {
        let message = error.details.map(item => item.message).join(",")

        return {
            status: false,
            message: message
        }
    }

    return {
        status: true,
    }
}
// create and export funct to get all user
exports.getUser = async (request, response) => {
    try {
        let result = await modelUser.findAll()

        return
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.findUSer = async (request, response) => {
    try {
        // get the keyword of search
        let keyword = request.body.keyword

        let result = await modelUser.findAll({
            where: {
                [Op.or] : {
                    nama_user: {[Op.substring]: keyword},
                    role: {[Op.substring]: keyword},
                    username: {[Op.substring]: keyword}
                }
            }
        })

        return response.json({
            status: true,
            message: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.addUser = async (request, response) => {
    try {
        // validate a request
        let resultValidation = validateUser(request.body)

        if (resultValidation.status === false){
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        request.body.password = md5(request.body.password)

        // execute insert user using model
        await modelUser.create(request.body)

        // give a response
        return response.json({
            status: true,
            message: `Data user berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.updateUser = async (request, response) => {
    try {
        // get id_user
        let id_user = request.params.id_user
        
        // validate a request body
        let resultValidation = validateUser(request.body)
        if (resultValidation.status === false){
            return response.json({
                status: false,
                message: (await resultValidation).message
            })
        }

        // convert password to md5 if it exist
        if(request.body.password){
            request.body.password = md5(request.body.password)
        }

        // execute update user using model
        await modelUser.update(
            request.body,
            {where: {id_user: id_user}}
        )

        // give a response
        return response.json({
            status: true,
            message: `Data user berhasil diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.deleteUser = async (request, response) => {
    try {
        let id_user = request.params.id_user
        
        await modelUser.destroy({
            where: {id_user: id_user}
        })

        return response.json({
            status: true,
            message: `Data user telah dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}