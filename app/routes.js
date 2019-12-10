var User = require('./models/user');
const keys = require('../config/keys');
let https = require('https');
const request = require('request');

const sentiment_subscription_key = keys.azureSentimentAnalysis.subscriptionKey;
const sentiment_endpoint = keys.azureSentimentAnalysis.endpoint;
const computer_vision_subscription_key = keys.azureComputerVision.subscriptionKey;
const computer_vision_endpoint = keys.azureComputerVision.endpoint;

module.exports = function(app, passport){
    app.get('/', function(req, res){
        res.render('index.ejs');
    });

    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res){
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', { user: req.user, sentiment: '', tags:''});
    });
    app.post('/profile', isLoggedIn, function(req, res){
        let userInput = req.body.profileBio;
        let path = '/text/analytics/v2.1/sentiment';
        let sentimentVal = '';

        let response_handler = function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                let body_ = JSON.parse(body);
                let body__ = JSON.stringify(body_["documents"][0]["score"], null, '  ');
                console.log(body__);
                sentimentVal = body__;
                console.log(sentimentVal);
                //res.render('profile.ejs', { user: req.user, sentiment: sentimentVal, tags:''});
            });
            response.on('error', function (e) {
                console.log('Error: ' + e.message);
            });
        };

        let get_sentiments = function (documents) {
            let body = JSON.stringify(documents);

            let request_params = {
                method: 'POST',
                hostname: (new URL(sentiment_endpoint)).hostname,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': sentiment_subscription_key,
                }
            };

            let req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        }

        let documents = {
            'documents': [
                { 'id': '1', 'language': 'en', 'text': userInput }
            ]
        };

        get_sentiments(documents);

        let uriBase = computer_vision_endpoint + 'vision/v2.1/analyze';
        const imageUrl = req.body.imageURL;
        //const imageUrl = 'https://i.imgur.com/o8i9C8p.jpg';

// Request parameters.
        const params = {
            'visualFeatures': 'Description,Tags',
            'language': 'en'
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: '{"url": ' + '"' + imageUrl + '"}',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : computer_vision_subscription_key
            }
        };

        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let json = JSON.parse(body);
            let imageVal = JSON.stringify(json['description']['tags'], null, '  ');
            console.log(imageVal);
            //res.send(jsonResponse);
            res.render('profile.ejs', { user: req.user, sentiment: sentimentVal, tags: imageVal});

        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
            failureRedirect: '/' }));


    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}