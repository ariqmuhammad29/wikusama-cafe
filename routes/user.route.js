const express = require(`express`)

const app = express()

// allow to read request from body
app.use(express.json())

const userController = require(`../controllers/user.controller`)

app.get(`/user`, userController.getUser)

app.post(`/user/find`, userController.findUSer)

app.post(`/user`, userController.addUser)

app.put(`/user/:id_user`, userController.updateUser)

app.delete(`/user/:id_user`, userController.deleteUser)

module.exports = app