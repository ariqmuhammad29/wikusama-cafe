// load express library
const express = require(`express`)
const app = express()

// load controller of transaksi
const transaksiControlller = require(`../controllers/transaksi.controller`)

// allow to read json on body request
app.use(express.json())

// create route to get all transaksi
app.get(`/transaksi`, transaksiControlller.getTransaksi)

// to add transaksi
app.post(`/transaksi`, transaksiControlller.addTransaksi),

// to edit transaksi
app.put(`/transaksi/:id_transaksi`, transaksiControlller.updateTransaksi)

// to delete transaksi
app.delete(`/transaksi/:id_transaksi`, transaksiControlller.deleteTransaksi)

module.exports = app