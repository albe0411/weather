const express = require('express')
const request = require('request')
const app = express()
const port = 3000

app.use(express.static('public'))
app.set('view engine', 'pug')

const apiKey = '3817fe54291af95d380ca51a2db84109'
let lat = '35.66775891376505';
let lon = '139.6966896320873';
let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

let weather
let temperatures = {}

request(url, function (err, response, body) {
    if (err) {
        console.log('error:', err);
    } else {
        weather = JSON.parse(body);

        let timezone = weather["city"]["timezone"] / 3600
        let currentDateTime = new Date(`${weather["list"][0]["dt_txt"].split(' ')[0]}T${weather["list"][0]["dt_txt"].split(' ')[1]}.000Z`)
        let currentDate = currentDateTime.toISOString().split('T')[0]
        let currentTime = new Date(currentDateTime.setHours(eval(`currentDateTime.getHours() + ${timezone}`))).toISOString().split('Z')[0].split('T')[1].slice(0, 5)

        temperatures[currentDate] = {};
        temperatures[currentDate]["temps"] = [];
        temperatures[currentDate]["times"] = [];

        for(let i = 0; i < weather["list"].length; i++) {
            let fullTimeThisLoop = new Date(`${weather["list"][i]["dt_txt"].split(' ')[0]}T${weather["list"][i]["dt_txt"].split(' ')[1]}.000Z`)
            let timeThisLoop = new Date(fullTimeThisLoop.setHours(eval(`fullTimeThisLoop.getHours() + ${timezone}`))).toISOString().split('Z')[0].split('T')[1].slice(0, 5)
            let dateThisLoop = fullTimeThisLoop.toISOString().split('T')[0]
            if(currentDate == dateThisLoop){
                temperatures[currentDate]["temps"].push(Math.round(weather["list"][i]["main"]["temp"] - 273.15))
                temperatures[currentDate]["times"].push(timeThisLoop)
            }else{
                if(dateThisLoop in temperatures){
                    temperatures[currentDate]["temps"].push(Math.round(weather["list"][i]["main"]["temp"] - 273.15))
                    temperatures[currentDate]["times"].push(timeThisLoop)
                }else{
                    currentDate = fullTimeThisLoop.toISOString().split('T')[0]
                    temperatures[currentDate] = {}
                    temperatures[currentDate]["temps"] = []
                    temperatures[currentDate]["times"] = []
                    temperatures[currentDate]["temps"].push(Math.round(weather["list"][i]["main"]["temp"] - 273.15))
                    temperatures[currentDate]["times"].push(timeThisLoop) 
                }
            }
        }
    }
})

app.get ('/', (req, res) => {
    let timezone = weather["city"]["timezone"] / 3600
    let firstDate = new Date(`${weather["list"][0]["dt_txt"].split(' ')[0]}T${weather["list"][0]["dt_txt"].split(' ')[1]}.000Z`)
    let currentDate = new Date(firstDate.setHours(eval(`firstDate.getHours() + ${timezone}`))).toISOString().split('T')[0]
    res.render('index', {
        'temperatures' : temperatures[currentDate],
        'city' : weather["city"]["name"],
        'date' : currentDate
    })
})

app.get('/api', (req, res) => {
    res.send(weather)
})

app.get ('/:date', (req, res) => {
    if (Object.hasOwn(temperatures, `${req.params.date}`)){
        res.render('index', {
            'temperatures' : temperatures[req.params.date], 
            'city' : weather["city"]["name"],
            'date' : req.params.date
        })
    }
    else{
        res.render('index', {
            'city' : weather["city"]["name"],
            'date' : req.params.date
        })
    }
})

app.listen(port, () => {
    console.log("Cerber is running")
})
