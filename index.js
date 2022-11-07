const express = require("express")
const cors = require("cors")
const app = express()

const PORT = 3009

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
  constructor(id) {
    this.id = id
  }

  asignarBatalla() {
    this.isInBattle = true
  }

  asignarMokepon(mokepon) {
    this.mokepon = mokepon
  }

  actualizarPosicion(x, y) {
    this.x = x
    this.y = y
  }

  asignarAtaques(ataques) {
    this.ataques = ataques
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre
  }
}

app.get("/unirse", (req, res) => {

  if (jugadores.length === 6) {
    res.status(400).send("El servidor está lleno")
    return
  }

  console.log(`\n+++++++++++++ Un jugador se ha unido ${Date.now()} +++++++++++++\n`)

  const id = `${Math.random()}`
  const jugador = new Jugador(id)
  jugadores.push(jugador)
  res.setHeader("Access-Control-Allow-Origin", "*")

  console.log(jugadores)

  console.log("\n++++++++++++++++++++++++++++++++++++++++++++++++++\n")
  
  res.send(id)
})

app.post("/mokepon/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const nombre = req.body.mokepon || ""
  const mokepon = new Mokepon(nombre)
  
  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarMokepon(mokepon)
  }

  console.log(`\n+++++++++++++ Mokepon Seleccionado ${Date.now()} +++++++++++++\n`)
  
  console.log(jugadores)

  console.log(`\n+++++++++++++ ++++++++++++++++++++++++++++++++++ +++++++++++++\n`)

  res.end()
})

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const x = req.body.x || 0
  const y = req.body.y || 0

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualizarPosicion(x, y)
  }

  const enemies = jugadores.filter((jugador) => jugadorId !== jugador.id)

  res.send({
    enemies
  })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const ataques = req.body.ataques || []
  
  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarAtaques(ataques)
  }

  console.log(`\n+++++++++++++ Ataques enviados ${Date.now()} +++++++++++++\n`)
  
  console.log(jugadores)

  console.log(`\n+++++++++++++ ++++++++++++++++++++++++++++++++++ +++++++++++++\n`)

  res.end()
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {

  const jugadorId = req.params.jugadorId || ""
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
  res.send({
    ataques: jugador.ataques || []
  })
})

app.delete("/mokepon/:playerId/eliminar", (req, res) => {

  console.log("\n+++++++++++++ Un jugador se ha desconectado +++++++\n")

  console.log(jugadores)

  console.log("\n---------------------------------------------------\n")

  const playerId = req.params.playerId || ""
  const playerIndex = jugadores.findIndex((player) => player.id === playerId)

  if (playerIndex >= 0) {
    jugadores.splice(playerIndex, 1)
  }

  console.log(jugadores)

  console.log("\n++++++++++++++++++++++++++++++++++++++++++++++++++\n")

  res.end()
})

app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`)
})
