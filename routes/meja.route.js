const express = require(`express`)
const app = express()

// allow to read request with json type
app.use(express.json())

// load controller of meja
const mejaController = require(`../controllers/meja.controller`)

// route to get all data meja
app.get(`/meja`, mejaController.getMeja)

// route to get available meja
app.get(`/meja/available`, mejaController.availableMeja)

// route to add meja
app.post(`/meja`, mejaController.addMeja)

// route to update meja
app.put(`/meja/:id_meja`, mejaController.updateMeja)

// route to delete meja
app.post(`/meja/id:meja`, mejaController.deleteMeja)

// export app object
module.exports = app
