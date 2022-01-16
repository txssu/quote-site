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

app.get('/pics/:id', (req, res) => {
    id = req.params.id;
    fs.readFile('./pics/' + id, function(err, data) {
        if (err) throw err;
        if (id.includes('.svg'))
        {
          res.writeHead(200, {'Content-Type': 'image/svg+xml '});
          res.end(data); 
        }
        else
        {
          res.writeHead(200, {'Content-Type': 'image/png'});
          res.end(data); 
        }
  });
});

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
});

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
  
start();
