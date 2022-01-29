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
    content = createElem('div', ['nname-cont'], [])
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

async function renderQuotes (count, offset) {
  const host = window.location.protocol + '//' + window.location.host
  const url = new URL(host + '/api/quotes')

  const params = { count: count, offset: offset }

  url.search = new URLSearchParams(params).toString()

  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      const feed = document.getElementById('feed')
      data.forEach(quote => {
        console.log(quote)
        feed.appendChild(renderQuote(quote))
      })
      updateGalleries()
    })
}

function updateGalleries () {
  [...document.getElementsByClassName('gallery')]
    .forEach((gallery) => {
      const images = gallery.getAttribute('data-images').split()
      $(gallery).imagesGrid({
        images: images,
        align: false
      })
    })
}

let allLoaded = false
const toggleAllLoaded = () => { allLoaded = true }

function loadFeed () {
  renderQuotes(10, 0)
  let offset = 10

  window.addEventListener('scroll', () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement

    if (scrollTop + clientHeight >= scrollHeight - 30 && !allLoaded) {
      renderQuotes(10, offset)
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
      console.log(data)
      document.getElementById('feed').appendChild(renderQuote(data))
      updateGalleries()
    })
}
