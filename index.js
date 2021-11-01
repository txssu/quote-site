const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose')
const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const path = require ('path');
const bodyParser = require('body-parser')
const quo = require('./models/quote')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const helpers = require('handlebars-helpers')();
const dotenv = require('dotenv');

// const LIMIT = 15

dotenv.config();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'))
app.use(express.static(path.join(__dirname + '/public')));

const options = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
};

app.get('/', async function(req, res) {
    var list = await quo.find({}).lean();
    list = list.reverse();
    for (var g = 0; g < list.length; g++) /*When the suffering is eternal!😳*/
    {
      if (Array.isArray(list[g].qu) && typeof list[g].qu[0] == 'object')
      {
        function unpack(elem, gapp)
        {
          var htm = []
          function _unpack(e, gap)
          {
            return {"_id": mongoose.Types.ObjectId(), "gap": gap*15, "element":e}
          }
          if (Array.isArray(elem))
          {
            for (var i = 0; i < elem.length; i++)
            {
              htm.push(unpack(elem[i], gapp+1))
            }
          }
          else
          {
            htm.push(_unpack(elem, gapp))
          }
          return htm
        }
        function isList(List) {
          return Array.isArray(List)
        }
        qu = list[g].qu
        if (qu.every(isList))
        {
          var re_qu = []
          for (var h = 0; h < qu.length; h++)
          {
            var a = unpack(qu[h], -1)
            re_qu.push(a)
          }
          re_qu = re_qu.flat(Infinity)
          list[g].qu = re_qu
        }
        else
        {
          var t = unpack(qu, -1)
          list[g].qu = t.flat(Infinity)
        }
      }
    }
    res.render('index', {title: 'СЬЛРЖАЛСЧ цитатник', list})
})

app.get('/index/:id', async function(req, res) {
    var list = await quo.find({}).lean();
    var g = Number(req.params.id);
    if (list[g])
    {
      if (Array.isArray(list[g].qu) && typeof list[g].qu[0] == 'object')
      {
        function unpack(elem, gapp)
        {
          var htm = []
          function _unpack(e, gap)
          {
            return {"_id": mongoose.Types.ObjectId(), "gap": gap*15, "element":e}
          }
          if (Array.isArray(elem))
          {
            for (var i = 0; i < elem.length; i++)
            {
              htm.push(unpack(elem[i], gapp+1))
            }
          }
          else
          {
            htm.push(_unpack(elem, gapp))
          }
          return htm
        }
        function isList(List) {
          return Array.isArray(List)
        }
        qu = list[g].qu
        if (qu.every(isList))
        {
          var re_qu = []
          for (var h = 0; h < qu.length; h++)
          {
            var a = unpack(qu[h], -1)
            re_qu.push(a)
          }
          re_qu = re_qu.flat(Infinity)
          list[g].qu = re_qu
        }
        else
        {
          var t = unpack(qu, -1)
          list[g].qu = t.flat(Infinity)
        }
      }
      
      res.render('result', {title:g, list: [list[g]]})
    }
    else
    {
      res.status(404);
      if (req.accepts('html')) {
        res.render('404', { url: req.get('host') + req.url });
        return;
      }
    }
})

// app.get('/create', function(req, res){
//   res.render('form', {title: 'Добавить цитату'})
// })

// var previousHour = new Date().toLocaleTimeString('ru-RU', { hour12: false, hour: "numeric"})
// var count = 0

// app.post('/quote', urlencodedParser, async function(req, res) {
//   var currentHour = new Date().toLocaleTimeString('ru-RU', { hour12: false, hour: "numeric"})
//   if (previousHour == currentHour)
//   {
//     count += 1;
//   }
//   else
//   {
//     previousHour = currentHour;
//     count = 0;
//   }
//   if (count <= LIMIT)
//   {
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0');
//     var yyyy = today.getFullYear();
//     var time = new Date().toLocaleTimeString('ru-RU', { hour12: false, 
//         hour: "numeric", 
//         minute: "numeric"});
//     var fff = String(dd + '.' + mm + '.' + yyyy) + ' в ' + time;
//     const quot = new quo({
//         qu: req.body['quote'],
//         au: req.body['auth'],
//         da: fff,
//         ip: (req.headers['x-forwarded-for']).split(',')[0]
//     })
//     await quot.save()
//     res.redirect('/')
//   }
//   else
//   {
//     res.status(403);
//     res.send('limit reached')
//   }
// })

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nAllow: /");
});

app.use(function(req, res, next) {
  res.status(404);

  if (req.accepts('html')) {
    res.render('404', { url: req.get('host') + req.url });
    return;
  }
})

async function start() {
    try {
      await mongoose.connect(
        process.env.TOKEN,
	{
          useNewUrlParser: true
        }
      )
      https.createServer(options, app).listen(3001);
    } catch (e) {
      console.log(e)
    }
}
  
start()
