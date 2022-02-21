const https = require('https')
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const path = require('path')
const { Schema } = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const mode = process.env.MODE || 'prod'

function quoIterate (glist) {
  const chatsPath = mode === 'dev' ? 'chats.json' : '../quote-bot/chats.json'
  let quoJSON = fs.readFileSync(chatsPath)
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

function notFound (req, res) {
  res.status(404)
  if (req.accepts('html')) {
    res.render('404', { url: req.get('host') + req.url })
  }
}

function uniteArr(arr)
{
    var i = 0
    while (true)
    {
        if (i > 0 && Array.isArray(arr[i]) && Array.isArray(arr[i - 1]))
        {
            for (let j = 0; j < arr[i].length; j++)
            {
                arr[i - 1].push(arr[i][j])
            }
            arr.splice(i, 1)
            i -= 1
        }
        if (arr.length > i)
        {
            i++
        }
        else
        {
            break
        }
    }
    return arr
}

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use('/pics', express.static('pics'))
app.use('/public', express.static('public'))
// app.use(express.static(path.join(__dirname, '/public')))

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

    var list = (await quo.find()
      .sort({ _id: -1 })
      .skip(offset)
      .limit(count)
      .lean())
      .map((elem) => { delete elem._id; return elem })
      .map((elem) => { elem.id = lastID--; return elem })

    for (let i = 0; i < list.length; i++)
    {
      list = Array.from(list)
      list[i].qu = uniteArr(list[i].qu)
    }

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

    var q = quote[id]
    q.qu = uniteArr(q.qu)

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
    notFound(req, res)
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
      notFound(req, res)
    }
  } else {
    notFound(req, res)
  }
})

app.use(function (req, res, next) {
  notFound(req, res)
})

async function start () {
  try {
    await mongoose.connect(
      process.env.TOKEN,
      {
        useNewUrlParser: true
      }
    )
    console.log('Started at https://localhost:3001')
    https.createServer(options, app).listen(3001)
  } catch (e) {
    console.log(e)
  }
}

start()
