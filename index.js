'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

var rlys=["Hi","Hello","Don't know what that mean..","Thanks for reply","Something is not right","This is some random reponse","Hello I'm 360","What does that mean?"]

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAASyePdFYgABAI83GTUqjyKpYtm40YePPdFlWZBbONmo0ohMn5mZCeFP8MW3FTsGXmR6KZB0aGZA74Xqf7jk48oog6lpTVW5QfS52WyBZBZCYIBBjS25phgpEWd7qrZBX09QptsgvC2lVqCSxKRLRhlHQF7DPeIbJMxMDuAX1JoEwZDZD"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "tokencheck123") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, rlys[getRandomInt(0, 7)])
			//sendText(sender, "Text echo: " + text.substring(0, 100)+" "+getRandomInt(0, 10))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})







