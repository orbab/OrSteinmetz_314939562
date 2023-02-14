const geocoder = require('google-geocoder');
const sql = require('./db');
const apiKey = require('./googleAPIKey')
const {User, Review} = require("./Objects");

const geo = geocoder({
    key: apiKey
});

const UserLogIn = (req, res) => {
    if (!req.body) {
        renderLogin(res, false, "Missing required inputs")
        return;
    }
    const username = req.body.username
    checkIfUsernameExists(username,
        (err) => {
            console.log("Error signing in: ", err);
            renderLogin(res, false, "Database error. Please try again later.")
        },
        (mysqlres) => {
            const user = mysqlres[0]
            if (user.userPassword === req.body.password) {
                res.cookie('logged_user', user)
                renderLogin(res, true, "Logged In Successfully!")
            } else {
                console.log(`Error signing in - password does not match for user ${user.username}`);
                renderLogin(res, false, "Incorrect password")
            }
        },
        () => {
            console.log("Error signing in - username does not exist");
            renderLogin(res, false, "Username does not exist")
        })
}

const UserRegister = (req, res) => {
    if (!req.body) {
        renderRegister(res, false, "Missing required inputs")
        return;
    }
    const user = new User(req.body.firstName, req.body.lastName, req.body.email, req.body.username, req.body.password)
    checkIfUsernameExists(user.userName,
        (err) => {
            console.log("Error registering user: ", err);
            renderRegister(res, false, "Database error. Please try again later.")
        },
        (err) => {
            console.log("Error registering user - username already exists: ", err);
            renderRegister(res, false, "That username already exists")
        },
        () => {
            checkIfEmailExists(user.email,
                (err) => {
                    console.log("Error registering user: ", err);
                    renderRegister(res, false, "Database error. Please try again later.")
                },
                (mysqlres) => {
                    console.log("Error registering user - email already exists");
                    renderRegister(res, false, "That email already exists")
                },
                () => {
                    const insertQ = 'INSERT INTO web.users SET ?';
                    sql.query(insertQ, user, (err, mysqlres) => {
                        if (err) {
                            console.log("Error registering user: ", err);
                            renderRegister(res, false, "Database error. Please try again later.")
                            return;
                        }
                        renderRegister(res, true, "Registered successfully!")
                    })
                })
        })
}

const UserUpdate = (req, res) => {
    const user = req.cookies.logged_user
    if (!req.body) {
        renderProfile(res, user, false, 'Missing required inputs')
        return;
    }
    const userUpdate = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email
    }
    if (user.email === userUpdate.email) {
        updateUser(userUpdate, user, res)
    } else {
        checkIfEmailExists(userUpdate.email,
            (err) => {
                console.log("Error updating user: ", err);
                renderProfile(res, user, false, 'Database error. Please try again later.')
            },
            (mysqlres) => {
                console.log("Error updating user - email already exists");
                renderProfile(res, user, false, 'That email already exists')
            },
            () => {
                updateUser(userUpdate, user, res)
            })
    }
}

const DeleteReview = (req, res) => {
    const user = req.cookies.logged_user
    if (!req.params) {
        renderProfile(res, user, false, 'Missing required params')
        return;
    }
    const params = [req.params.therapistId, req.params.userName, new Date(JSON.parse(req.params.reviewDate))]
    const Q = 'DELETE FROM reviews WHERE therapistId = ? and userName = ? and reviewDate = ?;'
    sql.query(Q, params, (err, mysqlres) => {
        if (err) {
            console.log("Error deleting review: ", err);
            renderProfile(res, user, false, '')
            return;
        }
        res.redirect('/profile')
    })
}

const GetSpecialties = (req, res) => {
    const specialtiesQ = 'SELECT distinct specialty FROM web.specialties'
    sql.query(specialtiesQ, (err, mysqlres) => {
        if (err) {
            console.log("Error getting specialties: ", err);
            res.status(400).send([])
            return;
        }
        const specialties = mysqlres.map(obj => obj.specialty)
        res.status(200).send(specialties)
    })
}

const GetTherapistsMarkers = (req, res) => {
    const therapistsQ = 'SELECT * FROM therapists'
    sql.query(therapistsQ, (err, mysqlres) => {
        if (err) {
            console.log("Error getting specialties: ", err);
            res.status(400).send([])
            return;
        }
        const specialties = mysqlres.map(obj => {
            return {
                "fullName": `${obj.firstName} ${obj.lastName}`,
                "address": obj.address
            }
        })
        res.status(200).send(specialties)
    })
}

const PostNewReview = (req, res) => {
    const user = req.cookies.logged_user
    if (!req.body) {
        res.send("Error posting review");
        return;
    }
    const newReview = new Review(
        req.query.therapist ? parseInt(req.query.therapist) : 0,
        user.userName,
        new Date(),
        req.body.reviewText,
        req.body.anonymous ? req.body.anonymous === 'on' : false,
        req.body.rating ? parseInt(req.body.rating) : 0
    )
    const insertQ = 'INSERT INTO web.reviews SET ?';
    sql.query(insertQ, newReview, (err) => {
        if (err) {
            console.log("Error posting review: ", err);
            res.send("Error posting review");
            return;
        }
        console.log("Posted review");
        res.send("<script>window.close();</script>");
    });
}

// ######################################## MISC. QUERIES #############################

function checkIfUsernameExists(username, dbErrorCallback, existsCallback, doesntExistCallback) {
    const usernameQ = 'SELECT * FROM users WHERE userName = ?'
    sql.query(usernameQ, username, (err, mysqlres) => {
        if (err) {
            dbErrorCallback(err)
            return;
        } else if (mysqlres.length !== 0) {
            existsCallback(mysqlres)
            return;
        }
        doesntExistCallback()
    })
}

function checkIfEmailExists(email, dbErrorCallback, existsCallback, doesntExistCallback) {
    const emailQ = 'SELECT email FROM users WHERE email = ?'
    sql.query(emailQ, email, (err, mysqlres) => {
        if (err) {
            dbErrorCallback(err)
            return;
        } else if (mysqlres.length !== 0) {
            existsCallback(mysqlres)
            return;
        }
        doesntExistCallback()
    })
}

function updateUser(userUpdate, user, res) {
    const params = [userUpdate, user.userName]
    const updateQ = 'UPDATE users SET ? WHERE userName = ?;';
    sql.query(updateQ, params, (err, mysqlres) => {
        if (err) {
            console.log("Error updating user: ", err);
            renderProfile(res, user, false, 'Database error. Please try again later.')
            return;
        }
        user.firstName = userUpdate.firstName
        user.lastName = userUpdate.lastName
        user.email = userUpdate.email
        res.cookie('logged_user', user)
        renderProfile(res, user, true, 'Updated successfully!')
    })
}

// ######################################## PAGE RENDERS #############################

function renderLogin(res, loginCompleted, resMsg) {
    const status = loginCompleted ? 200 : 400
    res.status(status).render('login-page', {
        isLoggedIn: false,
        selectedPage: 'login',
        loginCompleted: loginCompleted,
        resMsg: resMsg
    });
}

function renderRegister(res, registerCompleted, resMsg) {
    const status = registerCompleted ? 200 : 400
    res.status(status).render('register-page', {
        isLoggedIn: false,
        selectedPage: 'register',
        registerCompleted: registerCompleted,
        resMsg: resMsg
    });
}

function renderProfile(res, user, updateCompleted, resMsg) {
    const reviewQ = 'SELECT * FROM reviews as R JOIN therapists as T ON R.therapistId = T.therapistId WHERE userName = ?'
    const status = updateCompleted ? 200 : 400
    sql.query(reviewQ, user.userName, (err, mysqlres) => {
        if (err) {
            console.log("Error getting user reviews: ", err);
            res.status(status).render('profile-page', {
                isLoggedIn: true,
                selectedPage: 'profile',
                user: user,
                updateCompleted: updateCompleted,
                resMsg: resMsg,
                reviews: []
            });
            return;
        }
        const reviews = mysqlres.map(result => {
            return {
                "therapistFullName": `${result.firstName} ${result.lastName}`,
                "reviewText": result.reviewText,
                "rating": result.rating,
                "therapistId": result.therapistId,
                "userName": result.userName,
                "reviewDate": result.reviewDate.getTime()
            }
        })
        res.status(status).render('profile-page', {
            isLoggedIn: true,
            selectedPage: 'profile',
            user: user,
            updateCompleted: updateCompleted,
            resMsg: resMsg,
            reviews: reviews
        });
    })
}

function renderSearch(response, user, queryParams) {
    if (!queryParams) {
        response.render('search-page', {
            isLoggedIn: user !== undefined,
            selectedPage: 'search',
            therapists: [],
        });
    }
    let idsQ = '';
    let params = []
    if (!queryParams.specialty || queryParams.specialty === '') {
        idsQ = 'SELECT therapistId FROM therapists';
    } else {
        idsQ = 'SELECT T.therapistId FROM specialties as S JOIN therapists as T ON T.therapistId = S.therapistId WHERE s.specialty = ?';
        params.push(queryParams.specialty)
    }
    const radius = Math.floor(1 + (49 * (queryParams.radius / 100)))
    geo.find(queryParams.location, (err, res) => {
        let searchLocation;
        if (err && queryParams.location && queryParams.location !== '') {
            console.log("Error geocoding address: ", err);
            searchLocation = undefined;
        } else {
            searchLocation = res;
        }
        sql.query(idsQ, params, (err, idRes) => {
            if (err) {
                console.log("Error getting search results: ", err);
                response.render('search-page', {
                    isLoggedIn: user !== undefined,
                    selectedPage: 'search',
                    therapists: [],
                });
                return;
            }
            const ids = idRes.map(res => res.therapistId)
            const searchQ = `SELECT T.therapistId, T.firstName, T.lastName, T.address, T.gender, S.specialty, round(avg(R.rating) ,1) as averageRating FROM web.specialties as S JOIN web.therapists as T ON T.therapistId = S.therapistId JOIN web.reviews as R ON T.therapistId = R.therapistId WHERE T.therapistId IN (${arrayToString(ids)}) GROUP BY T.therapistId, S.specialty`;
            sql.query(searchQ, async (err, searchRes) => {
                if (err) {
                    console.log("Error getting search results: ", err);
                    response.render('search-page', {
                        isLoggedIn: user !== undefined,
                        selectedPage: 'search',
                        therapists: [],
                    });
                    return;
                }
                const searchResults = []
                for (const sqlResult of searchRes) {
                    let therapist = searchResults.find(th => th.therapistId === sqlResult.therapistId)
                    if (therapist !== undefined) {
                        therapist.specialties += `, ${sqlResult.specialty}`
                    } else {
                        therapist = {
                            "therapistId": sqlResult.therapistId,
                            "fullName": `${sqlResult.firstName} ${sqlResult.lastName}`,
                            "specialties": sqlResult.specialty,
                            "address": sqlResult.address,
                            "gender": sqlResult.gender,
                            "averageRating": sqlResult.averageRating
                        }
                        if (searchLocation !== undefined) {
                            await new Promise(resolve => {
                                geo.find(therapist.address, (err, res) => {
                                    if (err) {
                                        console.log("Error geocoding address: ", err);
                                        searchResults.push(therapist);
                                    }
                                    const distance = calcDistance(searchLocation[0].location, res[0].location)
                                    if (distance <= radius) {
                                        //Add the therapist to results list
                                        searchResults.push(therapist);
                                    }
                                    resolve();
                                })
                            })
                        } else {
                            searchResults.push(therapist);
                        }
                    }
                }
                response.render('search-page', {
                    isLoggedIn: user !== undefined,
                    selectedPage: 'search',
                    therapists: searchResults,
                });
            })
        })
    })
}

function renderHealer(res, therapistId, isLoggedIn) {
    const therapistQ = 'SELECT t.therapistId, t.firstName, t.lastName, t.address, t.gender, t.website, t.phone, t.therapistDescription, s.specialty, round(avg(R.rating) ,1) as averageRating FROM web.therapists as t JOIN web.specialties as s ON t.therapistId = s.therapistId JOIN reviews as r ON r.therapistId = t.therapistId WHERE t.therapistId = ? GROUP BY t.therapistId, s.specialty'
    sql.query(therapistQ, therapistId, (err, mysqlres) => {
        if (err) {
            console.log("Error getting therapist: ", err);
            res.render('healer-profile-page', {
                isLoggedIn: isLoggedIn,
                selectedPage: 'healer',
                therapist: {},
                reviews: []
            });
            return;
        }
        const specialties = []
        for (const result of mysqlres) {
            specialties.push(result.specialty)
        }
        const therapist = {
            "therapistId": mysqlres[0].therapistId,
            "fullName": `${mysqlres[0].firstName} ${mysqlres[0].lastName}`,
            "gender": mysqlres[0].gender,
            "address": mysqlres[0].address,
            "website": mysqlres[0].website,
            "phone": mysqlres[0].phone,
            "description": mysqlres[0].therapistDescription,
            "specialties": arrayToString(specialties),
            "averageRating": mysqlres[0].averageRating
        }
        const reviewsQ = 'SELECT * FROM web.reviews WHERE therapistId = ?'
        sql.query(reviewsQ, therapist.therapistId, (err, reviewsRes) => {
            if (err) {
                console.log("Error getting therapist reviews: ", err);
            }
            res.render('healer-profile-page', {
                isLoggedIn: isLoggedIn,
                selectedPage: 'healer',
                therapist: therapist,
                reviews: reviewsRes
            });
        })
    })
}

// ######################################## MISC. FUNCTIONS #############################

function calcDistance(p1, p2) {
    const R = 6378137 / 1000; // Earth’s mean radius in KM
    const dLat = degToRad(p2.lat - p1.lat);
    const dLong = degToRad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(p1.lat)) * Math.cos(degToRad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // returns the distance in meter
}

function degToRad(x) {
    return x * Math.PI / 180;
}

function arrayToString(arr) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i < arr.length - 1) {
            str += ', ';
        }
    }
    return str;
}

module.exports = {UserLogIn, UserRegister, UserUpdate, renderProfile, DeleteReview, renderSearch, GetSpecialties, GetTherapistsMarkers, renderHealer, PostNewReview};