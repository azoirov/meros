function selectOne(selector) {
   return document.querySelector(selector)
}

function selectAll(selector) {
   return document.querySelectorAll(selector)
}

function addClass(element, className) {
   element.classList.add(className)
}

function removeClass(element, className) {
   element.classList.remove(className)
}

function clearText(text) {
   return text.trim()
}

async function fetchFunction(url, method, body) {
   let response = await fetch(url, {
      headers: {
         'Content-Type': 'application/json; charset=utf-8'
      },
      method: method,
      body: JSON.stringify(body)
   })
   return await response.json()
}

export { selectOne, selectAll, addClass, removeClass, fetchFunction, clearText }