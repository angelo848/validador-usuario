const express = require('express')
const nunjuncks = require('nunjucks')

const app = express()

nunjuncks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'njk')

const ageMiddleware = (req, res, next) => {
  const { age } = req.query

  if (!age) res.redirect('/')

  return next()
}

app.get('/', (req, res) => {
  return res.render('userAge')
})

app.post('/check', (req, res) => {
  const { age } = req.body

  if (isNaN(age)) {
    return res.redirect('/errorPage')
  }

  if (age >= 18) {
    return res.redirect(`/major?age=${age}`)
  } else {
    return res.redirect(`/minor?age=${age}`)
  }
})

app.get('/major', ageMiddleware, (req, res) => {
  const { age } = req.query
  return res.render('majorAge', { age })
})

app.get('/minor', ageMiddleware, (req, res) => {
  const { age } = req.query
  return res.render('minorAge', { age })
})

app.get('/errorPage', (req, res) => {
  return res.render('errorPage')
})

app.listen(3000)
