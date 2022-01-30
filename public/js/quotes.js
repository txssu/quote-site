'use strict'

function nestedElems (elems) {
  return elems.reverse().reduce((inner, outer) => {
    outer.appendChild(inner)
    return outer
  })
}

function appendChildren (elem, children) {
  const appender = (res, child) => {
    res.appendChild(child)
    return res
  }
  return children.reduce(appender, elem)
}

function appendAttrs (elem, attrs) {
  const appender = (res, attr) => {
    res.setAttribute(attr[0], attr[1])
    return res
  }
  return Object.entries(attrs).reduce(appender, elem)
}

function createElem (tag, classes = [], children = [], attrs = {}) {
  let elem = document.createElement(tag)
  elem.classList = classes
  elem = appendAttrs(elem, attrs)
  return appendChildren(elem, children)
}

function quoteTitle (quote) {
  // Ссылка
  const a = createElem('a', ['id'])
  a.href = window.location.pathname + '/' + quote.id
  a.innerHTML = `#${quote.id}`
  if (quote.id === 1) toggleAllLoaded()

  // Дата
  const date = createElem('div', ['date'])
  date.innerHTML = quote.da || 'Очень давно'

  // Заголовок
  const title = createElem('div', ['title-row'], [a, date])

  return title
}

function renderMessage (message) {
  let content
  if (Array.isArray(message)) {
    const messages = message.map(renderMessage)
    content = createElem('div', ['nested-nname-cont'], messages)
  } else {
    content = createElem('div', ['nname-cont'], [], {style: 'margin-bottom: 20px'})
    if (message.name) {
      const name = createElem('a', ['nname'], [], { style: 'display: inline-block;' })
      name.innerHTML = message.name
      content.appendChild(name)
    } if (message.text) {
      const text = createElem('div', ['el-text'], [], { style: 'display: inline-block;height: auto; display: block; white-space: pre-line; font-size: 16px !important;' })
      text.innerHTML = message.text
      content.appendChild(text)
    } if (typeof message.qu === 'string') {
      const text = createElem('div', ['el-text'], [], { style: 'display: inline-block;height: auto; display: block; white-space: pre-line; font-size: 16px !important;' })
      text.innerHTML = message.qu
      content.appendChild(text)
    } if (message.audio) {
      content.appendChild(
        nestedElems([
          createElem('audio', ['au'], [], { controls: '' }),
          createElem('source', ['au'], [], { src: message.audio, type: 'audio/mp3' })
        ])
      )
    } if (message.images && message.images.length !== 0) {
      content.appendChild(
        createElem('div', ['gallery'], [], {
          style: 'margin-top: 5px;',
          'data-images': message.images.join()
        })
      )
    }
  }

  return content
}

function quoteContent (quote) {
  if (Array.isArray(quote.qu)) { return createElem('div', ['content'], quote.qu.map((message) => renderMessage(message))) } else { return createElem('div', ['content'], [renderMessage(quote)]) }
}

function quoteBottom (quote) {
  let author
  if (quote.link) {
    author = createElem('a', ['author'])
    author.href = quote.link
  } else {
    author = createElem('div', ['author'])
  }

  author.innerHTML = '— ' + quote.au

  return createElem('div', ['bottom-row'], [author])
}

function renderQuote (quote) {
  const result = createElem('div',
    ['cont'],
    [
      quoteTitle(quote),
      quoteContent(quote),
      quoteBottom(quote)
    ])
  return result
}

async function renderQuotes (count, offset, chat) {
  const host = window.location.protocol + '//' + window.location.host
  const url = new URL(host + '/api/quotes/' + chat)

  const params = { count: count, offset: offset }

  url.search = new URLSearchParams(params).toString()

  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      const feed = document.getElementById('feed')
      data.forEach(quote => {
        feed.appendChild(renderQuote(quote))
        updateText()
      })
      updateGalleries()
      updateText()
    })
  
}

function updateGalleries () {
  [...document.getElementsByClassName('gallery')]
    .forEach((gallery) => {
      const images = gallery.getAttribute('data-images').split(',')
      $(gallery).imagesGrid({
        images: images,
        align: false
      })
    })
}

function updateText () {
  var _b = document.getElementsByClassName('nname-cont')
  var b = []
  for (var i = 0; i < _b.length; i++)
  {
    if (_b[i].style.display != 'none')
    {
      b.push(_b[i])
    }
  }
  console.log(b)
  for (var x = 0; x < b.length; x++)
  {
      for (var y = x + 1; y < b.length; y++)
      {
          if(b[x].parentElement.className == b[y].parentElement.className && b[x].parentElement == b[y].parentElement)
          {
              if (b[x].firstElementChild && b[y].firstElementChild)
              {
                  var name1 = b[x].firstElementChild.innerText
                  var name2 = b[y].firstElementChild.innerText
              }
              if (name1 == name2)
              {
                  var temp = document.createElement('div');
                  temp.className = 'el-text';
                  temp.style = "white-space: pre-line;"
                  if (b[y].getElementsByClassName('el-text')[0] != undefined)
                  {
                      for (var i = 0; i < b[y].getElementsByClassName('el-text').length; i++)
                      {
                          temp.innerText = temp.innerText + b[y].getElementsByClassName('el-text')[i].innerText;
                      }
                  }
                  b[x].appendChild(temp);
                  if (b[y].getElementsByClassName('gallery')[0] != undefined)
                  {
                      for (var i = 0; i < b[y].getElementsByClassName('gallery').length; i++)
                      {
                          b[x].appendChild(b[y].getElementsByClassName('gallery')[i]);
                      }
                  }
                  b[y].style.display = "none";
              }
          }
          else
          {
            x = y
          }
          
      }
  }
  
  var c = document.getElementsByClassName('el-text')
  function matcher(element)
  {
      try
      {
          if (element.innerText.match(/\[(id|club)([0-9]+)\|([^\]]+)\]/))
          {
              var temp = element.innerText.match(/\[(id|club)([0-9]+)\|([^\]]+)\]/)
              var one = temp[1]
              var two = temp[2]
              var three = temp[3]
              var link = 'https://vk.com/' + one + two
              element.innerHTML = element.innerHTML.replaceAll(temp[0], '<a href="'+link+'">'+ three +'</a>')
              bla(element)
          }
      } catch(e) {
          return false
      }
  }
  for (var x = 0; x < c.length; x++)
  {
    matcher(c[x])
  }
  
  var h = document.getElementsByClassName('nested-nname-cont')
  h = [].slice.call(h)
  var c = document.getElementsByClassName('nname-cont')
  c = [].slice.call(c)
  for (var i = 0; i < h.length; i++)
  {
    for (var j = i + 1; j < h.length; j++)
    {
      var index_one = c.indexOf(h[i].lastElementChild)
      var index_two = c.indexOf(h[j].firstChild)
      if (h[i].parentElement == h[j].parentElement && index_two == index_one + 1)
      {
          var temp = h[j].getElementsByClassName('nname-cont')
          for (var ii = 0; ii < temp.length; ii++)
          {
            h[i].appendChild(temp[ii])
          }
          console.log(h[i], h[j])
      }
      else
      {
        i = j
      }
    }
  }
}

let allLoaded = false
const toggleAllLoaded = () => { allLoaded = true }

function loadFeed (chat) {
  renderQuotes(10, 0, chat)
  let offset = 10

  window.addEventListener('scroll', () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement

    if (scrollTop + clientHeight >= scrollHeight - 30 && !allLoaded) {
      renderQuotes(10, offset, chat)
      offset += 10
    }
  }, {
    passive: true
  })
}

function loadById () {
  const id = window.location.pathname.split('/').at(-1)

  const host = window.location.protocol + '//' + window.location.host
  const url = new URL(host + '/api/quote/' + id)

  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      document.getElementById('feed').appendChild(renderQuote(data))
      updateGalleries()
      updateText()
    })
}
