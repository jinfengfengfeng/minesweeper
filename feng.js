const log = console.log.bind(console)

const e = selector => document.querySelector(selector)

const appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}