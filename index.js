const https = require('https')
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const path = require('path')
const { Schema } = require('mongoose')
const dotenv = require('dotenv')

function quoIterate (glist) {
  let quoJSON = fs.readFileSync('../quote-bot/chats.json')
  quoJSON = JSON.parse(quoJSON)
  const quoList = []
  for (let i = 0; i < quoJSON.chats.length; i++) {
    const temp = quoJSON.chats[i][[Object.keys(quoJSON.chats[i])]]
    if (!glist.includes(temp)) {
      mongoose.model(temp, new Schema({}), temp)
    }
    quoList.push(temp)
  }

  return quoList
}
let quoList = quoIterate([])

dotenv.config()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use('/public', express.static('public'))
app.use(express.static(path.join(__dirname, '/public')))

const options = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
}

app.get('/api/quotes/:id', async function (req, res) {
  const offset = req.query.offset || 0
  const count = req.query.count || 15
  const chat = String(req.params.id)
  quoList = quoIterate(quoList)

  if (quoList.includes(chat)) {
    const quo = mongoose.model(chat)
    let lastID = await quo.count() - 1 - offset

    const list = (await quo.find()
      .sort({ _id: -1 })
      .skip(offset)
      .limit(count)
      .lean())
      .map((elem) => { delete elem._id; return elem })
      .map((elem) => { elem.id = lastID--; return elem })

    res.writeHead(200, { 'Content-Type': 'application/json ' })
    res.end(JSON.stringify(list))
  }
})

app.get('/api/quote/:chat/:id', async function (req, res) {
  const id = req.params.id
  const chat = req.params.chat

  quoList = quoIterate(quoList)
  if (quoList.includes(chat)) {
    const quo = mongoose.model(chat)

    const list = (await quo.find()
      .sort({ _id: 1 })
      .lean())
      .map((elem) => { delete elem._id; return elem })

    const quote = Array.from(list)

    const q = quote[id]

    q.id = id

    res.writeHead(200, { 'Content-Type': 'application/json ' })
    res.end(JSON.stringify(q))
  }
})

app.get('/', async function (req, res) {
  quoList = quoIterate(quoList)

  const chats = []
  for (let i = 0; i < quoList.length; i++) {
    const quo = mongoose.model(quoList[i])
    const list = await quo.find({}).lean()
    const temp = {}
    temp.name = quoList[i]
    temp.count = list.length
    chats.push(temp)
  }
  res.render('main', { title: 'СЬЛРЖАЛСЧ цитатник', chats })
})
app.get('/pics/:id', (req, res) => {
  const id = req.params.id
  fs.readFile('./pics/' + id, function (err, data) {
    if (err) throw err
    if (id.includes('.svg')) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml ' })
      res.end(data)
    } else {
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.end(data)
    }
  })
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

app.get('/:id', async function (req, res) {
  const idd = String(req.params.id)
  quoList = quoIterate(quoList)
  if (quoList.includes(idd)) {
    res.render('index', { title: idd })
  } else {
    res.status(404)

    if (req.accepts('html')) {
      res.render('404', { url: req.get('host') + req.url })
    }
  }
})

app.get('/:name/:id', async function (req, res) {
  const g = Number(req.params.id)
  const name = String(req.params.name)
  quoList = quoIterate(quoList)
  if (quoList.includes(name)) {
    const quo = mongoose.model(name)

    const list = await quo.find({}).lean()
    if (list[g]) {
      res.render('result', { title: name + '/' + String(g) })
    } else {
      res.status(404)
      if (req.accepts('html')) {
        res.render('404', { url: req.get('host') + req.url })
      }
    }
  } else {
    res.status(404)

    if (req.accepts('html')) {
      res.render('404', { url: req.get('host') + req.url })
    }
  }
})

app.use(function (req, res, next) {
  res.status(404)
  if (req.accepts('html')) {
    res.render('404', { url: req.get('host') + req.url })
  }
})

async function start () {
  try {
    await mongoose.connect(
      process.env.TOKEN,
      {
        useNewUrlParser: true
      }
    )
    https.createServer(options, app).listen(3001)
  } catch (e) {
    console.log(e)
  }
}

start()
