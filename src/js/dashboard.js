import './../scss/sheets/dashboard.scss'
let getApp = require('./appTransactions').getApp
let login = require('./login').default

let appState = () => {
    let current = window.localStorage.getItem('application')
    let info = JSON.parse(window.localStorage.getItem('stutoken'))

    if (info.rsvp) return 5

    else if (!current && !info.aid) return 0

    else if (info.aid) 
        return getApp(info, current)

    return 1
}
const thisState = appState()
// *
let fillBanner = async auth0 => {
    let temp
    // *
    let now = new Date(); now = now.getHours()
    let tod = document.getElementById('time-of-day')
    switch (true) {
        case (now > 2 && now < 12):
        temp = 'morning'; break
        case (now > 16):
        temp = 'evening'; break
        default:
        temp = 'afternoon'
    }
    tod.innerHTML = temp
    // -
    let message = document.getElementById('user-message')
    switch (thisState) {
        case 0:
        temp = "You're set to start your application"; break
        case 1:
        temp = "We've saved your spot"; break
        case 2:
        temp = "Thanks for applying, we'll get back to you shortly"
        case 3:
        temp = "Thanks for applying, but we have too many participants \
        and couldn't give you a spot this year :("; break
        case 4:
        temp = "Congratulations on your acceptance! Please RSVP to \
        secure your spot"; break
        case 5: 
        temp = "Thanks for the RSVP! See you January 31st"; break

        default: temp = "Something went wrong..."
    }
    message.innerHTML = temp
    return
}
// -
let fillInfo = async auth0 => {
    let info = JSON.parse(window.localStorage.getItem('stuinfo'))
    // if (!info) login()
    // *
    let imgArea = document.getElementById('image-area')

    let img = document.createElement('img')
    img.id = "profile-photo"
    img.src = info.picture

    imgArea.appendChild(img)
    // -
    let name = document.getElementById('user-name')
    if (info.name ===info.email) document.getElementById('user-attrs').removeChild(name)
    else name.innerHTML = info.name
    // -
    let email = document.getElementById('user-email')
    email.innerHTML = info.email
    return
}
// -
let fillButton = async auth0 => {
    let button = document.getElementById('app-button')
    let btnIco = document.createElement('i')
    //*
    if (!thisState) {
        button.firstElementChild.innerHTML = "New"
        btnIco.className = 'fas fa-plus-square'

    }
    else {
        button.firstElementChild.innerHTML = "Continue"
        btnIco.className = 'far fa-caret-square-right'
    }
    button.appendChild(btnIco)
    button.addEventListener('click', () => window.location = "/application.html")
    return
}
// -

let updateStatus = (statDom, state) => {
    statDom = statDom.lastElementChild

    let indicator = document.createElement('i')
    if (state) {
        statDom.firstElementChild.classList.add('on-indicator')
        indicator.className = "fas fa-check"
    }
    else {
        statDom.firstElementChild.classList.remove('on-indicator')
        indicator.className = "fas fa-times"
    }
    statDom.firstElementChild.appendChild(indicator)
    return
}
let status = async () => {
    Array.from(document.getElementsByClassName('status'))
        .forEach(s => updateStatus(s, false))
}
// *
login([fillBanner, fillInfo, fillButton, status])
