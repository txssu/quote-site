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
  const a = createElem('a', ['id'], [], { href: window.location.pathname + '/' + quote.id })
  a.innerHTML = `#${quote.id}`
  if (quote.id === 1) toggleAllLoaded()

  // Дата
  const date = createElem('div', ['date'])
  date.innerHTML = quote.da || 'Очень давно'

  // Заголовок
  const title = createElem('div', ['title-row'], [a, date])

  return title
}

function joinPhrasesWithSameAuthor (phrases) {
  return phrases.reduce((result, current) => {
    console.log(current.name, result.at(-1)?.name)
    if (current.name && result.at(-1)?.name === current.name) {
      const last = result.at(-1)
      last.text += '\n' + current.text
      return result
    } else {
      result.push(current)
      return result
    }
  }, [])
}

function preprocessQuoteText (text) {
  const pattern = /\[(id|club)([0-9]+)\|([^\]]+)\]/

  return text.replace(pattern, (_, mentionType, id, mentionText) => {
    const link = createElem('a', [], [], { href: `https://vk.com/${mentionType + id}` })
    link.innerHTML = mentionText
    return link.outerHTML
  })
}

function renderMessage (message) {
  let content
  if (Array.isArray(message)) {
    const messages = message.map(renderMessage)
    content = createElem('div', ['nested-nname-cont'], messages)
  } else {
    content = createElem('div', ['nname-cont'], [], { style: 'margin-bottom: 20px' })
    if (message.name) {
      const name = createElem('a', ['nname'], [], { style: 'display: inline-block;', href: message.link })
      name.innerHTML = message.name
      content.appendChild(name)
    } if (message.text || typeof message.qu === 'string') {
      const text = createElem('div', ['el-text'], [], { style: 'display: inline-block;height: auto; display: block; white-space: pre-line; font-size: 16px !important;' })
      text.innerHTML = preprocessQuoteText(message.text || message.qu)
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
  if (Array.isArray(quote.qu)) {
    quote.qu = joinPhrasesWithSameAuthor(quote.qu)
    return createElem('div', ['content'], quote.qu.map((message) => renderMessage(message)))
  } else {
    return createElem('div', ['content'], [renderMessage(quote)])
  }
}

function quoteBottom (quote) {
  let author
  if (quote.link) {
    author = createElem('a', ['author'], [], { href: quote.link })
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
      })
      updateGalleries()
      updateText()
    })
  async function bounce () {
    await sleep(1000)
    lever(chat, offset + 10)
  }

  bounce()
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
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
  let h = document.getElementsByClassName('nested-nname-cont')
  h = [].slice.call(h)
  let c = document.getElementsByClassName('nname-cont')
  c = [].slice.call(c)
  for (var i = 0; i < h.length; i++) {
    for (let j = i + 1; j < h.length; j++) {
      const index_one = c.indexOf(h[i].lastElementChild)
      const index_two = c.indexOf(h[j].firstChild)
      if (h[i].parentElement == h[j].parentElement && index_two == index_one + 1) {
        var temp = h[j].getElementsByClassName('nname-cont')
        for (let ii = 0; ii < temp.length; ii++) {
          h[i].appendChild(temp[ii])
        }
      } else {
        i = j
      }
    }
  }
}

let allLoaded = false
const toggleAllLoaded = () => { allLoaded = true }

function lever (chat, offset) {
  $(window).scroll(function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement
    const percent = scrollTop / (scrollHeight - clientHeight)
    console.log(percent)
    if (percent >= 0.95 && !allLoaded) {
      $(window).unbind('scroll')
      renderQuotes(10, offset, chat)
    }
  })
}

function loadFeed (chat) {
  renderQuotes(10, 0, chat)
}

function loadById () {
  const id = window.location.pathname
  const host = window.location.protocol + '//' + window.location.host
  const url = new URL(host + '/api/quote' + id)

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
