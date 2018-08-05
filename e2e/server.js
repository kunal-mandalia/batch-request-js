const express = require('express')

class Server {
  constructor (port = 5000) {
    this.port = port
    this.server = express()
    this.server.get('/query', async (req, res) => {
      await this.simulateNetwork()
      res.status(200).json({
        data: {
          timestamp: Date.now()
        }
      })
    })
  }

  async simulateNetwork (maxLatency = 2000) {
    const ms = Math.floor(Math.random() * maxLatency)
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async start () {
    // server.listen returns http.Server with a close
    // method, which we use for stopping the server
    this.server = await this.server.listen(this.port)
  }

  async stop () {
    await this.server.close()
  }
}
const server = new Server()

module.exports = server
