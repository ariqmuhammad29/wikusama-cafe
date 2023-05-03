const express = require(`express`)
const app = express()

// load controller of menu
const menuController = require(`../controllers/menu.controller`)

// create route for add menu
app.post(`/menu`, menuController.addMenu)

// to get all menu
app.get(`/menu`, menuController.getMenu)

// to search menu
app.get(`/menu/find`,menuController.findMenu)

// to update menu
app.put(`/menu/:id_menu`, menuController.updateMenu)

// to delete menu
app.delete(`/menu/:id_menu`, menuController.deleteMenu)

module.exports = app