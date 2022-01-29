const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose')
const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const path = require ('path');
const bodyParser = require('body-parser');
const { Schema, model } = require('mongoose'); 
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const helpers = require('handlebars-helpers')();
const dotenv = require('dotenv');

function quo_iterate(glist)
{
  var quo_json = fs.readFileSync('../quote-bot/chats.json');
  quo_json = JSON.parse(quo_json)
  var quo_list = [];
  for (var i = 0; i < quo_json.chats.length; i++)
  {
    temp = quo_json.chats[i][[Object.keys(quo_json.chats[i])]]
    if (!glist.includes(temp))
    {
      mongoose.model(temp, new Schema({}), temp); 
    }
    quo_list.push(temp)
  }

  return quo_list
}
var quo_list = quo_iterate([])

dotenv.config();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'))
app.use(express.static(path.join(__dirname + '/public')));

const options = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
};

app.get('/api/quotes', async function (req, res) {
  let offset = req.query.offset || 0;
  let count = req.query.count || 15;

  quo_list = quo_iterate(quo_list)


  var quo = mongoose.model('freespeak')
  var list = await quo.find()
    .sort({ "_id": -1 })
    .skip(offset)
    .limit(count)
    .lean();
  list.forEach(element => {
    delete element._id
  });

  res.writeHead(200, { 'Content-Type': 'application/json ' })
  res.end(JSON.stringify(list))
})

app.get('/', async function(req, res) {

  quo_list = quo_iterate(quo_list);

  var chats = [];
  for (var i = 0; i < quo_list.length; i++)
  {
    var quo = mongoose.model(quo_list[i]);
    var list = await quo.find({}).lean();
    var temp = {};
    temp["name"] = quo_list[i];
    temp["count"] = list.length
    chats.push(temp);
  }
    res.render('main', {title: 'СЬЛРЖАЛСЧ цитатник', chats})

});
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
  res.send("User-agent: *\nDisallow: /");
});
app.get('/all/:id', async function(req, res) {
  var idd = String(req.params.id);
  quo_list = quo_iterate(quo_list)
  if (quo_list.includes(idd))
  {
    var quo = mongoose.model(idd)
    var list = await quo.find({}).lean();
    list = list.reverse();
    var offset = 0
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
    res.render('index', {title: idd, list, offset})
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
app.get('/:id', async function(req, res) {
    var idd = String(req.params.id);
    quo_list = quo_iterate(quo_list)
    if (quo_list.includes(idd))
    {
      var quo = mongoose.model(idd)
      var list = await quo.find({}).lean();
      if (list.length > 50)
      {
        var glist = list.reverse();
        list = [];
        for (var i = 0; i < 50; i++)
        {
          list.push(glist[i])
        }
        var offset = glist.length - 50
  
      }
      else
      {
        list = list.reverse();
        var offset = 0
      }
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
      res.render('index', {title: idd, list, offset})
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

app.get('/:name/:id', async function(req, res) {
    var g = Number(req.params.id);
    var name = String(req.params.name);
    quo_list = quo_iterate(quo_list)
    if (quo_list.includes(name))
    {
      var quo = mongoose.model(name)

      var list = await quo.find({}).lean();
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
        res.render('result', {title:g, chat:name, list: [list[g]]}) 
      }
      else
      {
        res.status(404);
        if (req.accepts('html')) {
            res.render('404', { url: req.get('host') + req.url });
          return;
        }
      }
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
