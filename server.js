const express = require(`express`)
const app = express()
// define port to the server
const PORT = 8000

const cors = require(`cors`)
app.use(cors())

// load of meja
const mejaRoute = require(`./routes/meja.route`)
// load of menu
const menuRoute = require(`./routes/menu.route`)
// load of user
const userRoute = require(`./routes/user.route`)
// load rouet of transaksi
const transaksiRoute = require(`./routes/transaksi.route`)

// regiter route of meja
app.use(mejaRoute)

// register route of menu
app.use(menuRoute)

// register user
app.use(userRoute)

// regisster transaksi
app.use(transaksiRoute)

app.use(express.static(__dirname))

// run the server
app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
})

