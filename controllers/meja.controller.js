/**function untuk mengolah request dan memberikan response */

const { response } = require("express")

// call model meja
const mejaModel = require(`../models/index`).meja

// call joi library
const joi = require(`joi`)

//define funct to validate input of meja
const validateMeja = async(input) => {
    // define rules of validation
    let rules = joi.object().keys({
        nomor_meja: joi.string().required(),
        status: joi.boolean().required()
    })
    // validation process
    let {error} = rules.validate(input)

    // arrange a error message of validation
    if(error) {
        let message = error
        .details
        .map(item => item.message)
        .join(`,`)

        return{
            status: false,
            message: message
        }
    }
    return { status: true}
}

//create and export function to load meja
exports.getMeja = async (request, response) => {
    try {
        // call meja from databse using model
        let meja = await mejaModel.findAll()
        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and export function to filter available meja
exports.availableMeja = async (request, response) => {
    try {
        // define parameter for status true
        let param = { status: true }

        // get data meja from db using models
        let meja = await mejaModel.findAll({ where: param })

        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and export function to add new meja
exports.addMeja = async (request, response) => {
    try {
        // validated data
        let resultValidation = validateMeja(request.body)

        if(!resultValidation.status){
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        // insert data Meja to database using model
        await mejaModel.create(request.body)

        // give a response to tell that insert has been successed
        return response.json({
            status: true,
            message: `Data meja berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and exports function to delete meja
exports.deleteMeja = async (request, response) => {
    try {
        // get id_meja tah will be delete
        let id_meja = request.params.id_meja

        // run delete meja using model
        await mejaModel.destroy({
            where: {id_meja: id_meja}
        })

        // give a response
        return response.json ({
            status: true,
            message: `Data meja berhasil dihapus`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}


//create and export funct to edit meja
exports.updateMeja = async (request, response) => {
    try {
        // get parameter for update
        let id_meja = request.params.id_meja

        //validate data meja
        let resultValidation = validateMeja(request.body)
        if(!resultValidation.status){
            // jika vaidasinya salah
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        /** run update meja */
        await mejaModel.update(request.body, {
            where:{id_meja: id_meja}
        })

        // give a response
        return response.json({
            status: true,
            message: `Data meja berhasil diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

