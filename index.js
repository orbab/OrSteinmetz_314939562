const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const CreateDB = require('./db/CreateDB');
const Queries = require('./db/Queries')

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'Static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser())
app.set('views', path.join(__dirname, 'PUG-Views'));
app.set('view engine', 'pug')

app.get('/createDB/Users/create', CreateDB.CreateUsersTable)
app.get('/createDB/Users/read', CreateDB.ShowUsersTable)
app.get('/createDB/Users/update', CreateDB.InsertUsers)
app.get('/createDB/Users/delete', CreateDB.DropUsersTable)

app.get('/createDB/Specialties/create', CreateDB.CreateSpecialtiesTable)
app.get('/createDB/Specialties/read', CreateDB.ShowSpecialtiesTable)
app.get('/createDB/Specialties/update', CreateDB.InsertSpecialties)
app.get('/createDB/Specialties/delete', CreateDB.DropSpecialtiesTable)

app.get('/createDB/Therapists/create', CreateDB.CreateTherapistsTable)
app.get('/createDB/Therapists/read', CreateDB.ShowTherapistTable)
app.get('/createDB/Therapists/update', CreateDB.InsertTherapists)
app.get('/createDB/Therapists/delete', CreateDB.DropTherapistTable)

app.get('/createDB/Reviews/create', CreateDB.CreateReviewsTable)
app.get('/createDB/Reviews/read', CreateDB.ShowReviewsTable)
app.get('/createDB/Reviews/update', CreateDB.InsertReviews)
app.get('/createDB/Reviews/delete', CreateDB.DropReviewsTable)

app.get('/createDB/DropAll', CreateDB.DropAllTables)

app.post('/login', Queries.UserLogIn)
app.post('/logout', (req, res) => {
    res.clearCookie('logged_user')
    res.redirect('/home')
})
app.post('/register', Queries.UserRegister)
app.post('/profile', Queries.UserUpdate)
app.get('/deleteReview/user/:userName/therapist/:therapistId/review/:reviewDate', Queries.DeleteReview)
app.get('/specialties', Queries.GetSpecialties)
app.get('/getTherapistsMarkers', Queries.GetTherapistsMarkers)
app.post('/review', Queries.PostNewReview)

app.get('/home', (req, res) => {
    res.render('home-page', {
        isLoggedIn: req.cookies.logged_user !== undefined,
        selectedPage: 'home',
    });
})

app.get('/login', (req, res) => {
    const user = req.cookies.logged_user;
    if (user !== undefined) {
        res.redirect('/home');
    }
    res.render('login-page', {
        isLoggedIn: req.cookies.logged_user !== undefined,
        selectedPage: 'login',
    });
})

app.get('/logout', (req, res) => {
    const user = req.cookies.logged_user;
    if (user === undefined) {
        res.redirect('/home');
    }
    res.render('logout-page', {
        isLoggedIn: req.cookies.logged_user !== undefined,
        selectedPage: 'logout',
    });
})

app.get('/register', (req, res) => {
    const user = req.cookies.logged_user;
    if (user !== undefined) {
        res.redirect('/home');
    }
    res.render('register-page', {
        isLoggedIn: req.cookies.logged_user !== undefined,
        selectedPage: 'register',
    });
})

app.get('/search', (req, res) => {
    const user = req.cookies.logged_user;
    Queries.renderSearch(res, user, req.query)
})

app.get('/profile', (req, res) => {
    const user = req.cookies.logged_user;
    if (user === undefined) {
        res.redirect('/home');
    }
    Queries.renderProfile(res, user, undefined, '')
})

app.get('/healer', (req, res) => {
    const therapistId = parseInt(req.query.therapist)
    const isLoggedIn = req.cookies.logged_user !== undefined
    Queries.renderHealer(res, therapistId, isLoggedIn)
})

app.get('/review', (req, res) => {
    res.render('write-review-page', {
        isLoggedIn: req.cookies.logged_user !== undefined,
        selectedPage: 'review',
        user: req.cookies.logged_user,
        therapistId: parseInt(req.query.therapist)
    });
})

app.get('/', (req, res) => {
    res.redirect('/home');
})

app.listen(port, () => {
    console.log(`Heal Me is running at http://localhost:${port}`);
});