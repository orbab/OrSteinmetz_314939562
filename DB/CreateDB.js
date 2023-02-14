const SQL = require('./db');
const {User, Therapist, Review} = require('./Objects')
const path = require('path');
const csv = require('csvtojson');

// ################################## USERS ###############################

const CreateUsersTable = (req, res) => {
    const Q = 'CREATE TABLE IF NOT EXISTS users (userName varchar(50) primary key, firstName varchar(50), lastName varchar(70), email varchar(100), userPassword varchar(50))';
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "Error in creating users table"});
            return;
        }
        console.log('created users table');
        res.send("users table created");
    })
}

const InsertUsers = (req, res) => {
    const Q = "INSERT INTO users SET ?";
    const csvFilePath = path.join(__dirname, "users.csv");
    csv().fromFile(csvFilePath).then((jsonObj) => {
        jsonObj.forEach(element => {
            const user = new User(element.firstName, element.lastName, element.email, element.userName, element.userPassword)
            SQL.query(Q, user, (err) => {
                if (err) {
                    console.log("error in inserting data", err);
                    return
                }
                console.log("created user row successfully");
            });
        });
    })

    res.send('Data inserted to Users table');
}

const ShowUsersTable = (req, res) => {
    const Q = "SELECT * FROM users";
    SQL.query(Q, (err, mySQLres) => {
        if (err) {
            console.log("error in showing users table ", err);
            res.status(400).send({message: "Error in showing Users table"});
            return;
        }
        console.log("Showing users table");
        res.send(mySQLres);
    })
}

const DropUsersTable = (req, res) => {
    const Q = "DROP TABLE users";
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "Error on dropping users table" + err});
            return;
        }
        console.log("users table dropped");
        res.send("Users table dropped");
    })
}

// ################################## THERAPISTS ###############################

const CreateTherapistsTable = (req, res) => {
    const Q = 'CREATE TABLE IF NOT EXISTS therapists (therapistId int primary key, firstName varchar(50), lastName varchar(70), gender int, address varchar (200), website varchar (100), phone varchar (20), therapistDescription varchar (300))';
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "Error in creating therapists table"});
            return;
        }
        console.log('created therapists table');
        res.send("Therapists table created");
    })
}

const InsertTherapists = (req, res) => {
    const Q = "INSERT INTO therapists SET ?";
    const csvFilePath = path.join(__dirname, "therapists.csv");
    csv().fromFile(csvFilePath).then((jsonObj) => {
        jsonObj.forEach(element => {
            const therapist = new Therapist(element.therapistId, element.firstName, element.lastName, element.gender, element.address, element.website, element.phone, element.therapistDescription);
            SQL.query(Q, therapist, (err) => {
                if (err) {
                    console.log("error in inserting data", err);
                    return
                }
                console.log("created therapist row successfully");
            });
        });
    })
    res.send('Data inserted to Therapist table');
}

const ShowTherapistTable = (req, res) => {
    const Q = "SELECT * FROM therapists";
    SQL.query(Q, (err, mySQLres) => {
        if (err) {
            console.log("error in showing therapists table ", err);
            res.status(400).send({message: "Error in showing Therapists table"});
            return;
        }
        console.log("Showing therapists table");
        res.send(mySQLres);
    })
}

const DropTherapistTable = (req, res) => {
    const Q = "DROP TABLE therapists";
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error in dropping therapists table ", err);
            res.status(400).send({message: "Error on dropping therapists table" + err});
            return;
        }
        console.log("therapists table dropped");
        res.send("Therapists table dropped");
    })
}

// ################################## SPECIALTIES ###############################

const CreateSpecialtiesTable = (req, res) => {
    const Q = 'CREATE TABLE IF NOT EXISTS specialties (therapistId int, specialty varchar (50), primary key (therapistId, specialty), foreign key (therapistId) references web.therapists (therapistId))';
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "Error in creating specialties table"});
            return;
        }
        console.log('created specialties table');
        res.send("Specialties table created");
    })
}

const InsertSpecialties = (req, res) => {
    const Q = "INSERT INTO specialties SET ?";
    const csvFilePath = path.join(__dirname, "specialties.csv");
    csv().fromFile(csvFilePath).then((jsonObj) => {
        jsonObj.forEach(element => {
            const specialty = {
                "therapistId": element.therapistId,
                "specialty": element.specialty
            };
            SQL.query(Q, specialty, (err) => {
                if (err) {
                    console.log("error in inserting data", err);
                    return
                }
                console.log("created specialty row successfully");
            });
        });
    })
    res.send('Data inserted to Specialties table');
}

const ShowSpecialtiesTable = (req, res) => {
    const Q = "SELECT * FROM specialties";
    SQL.query(Q, (err, mySQLres) => {
        if (err) {
            console.log("error in showing specialties table ", err);
            res.status(400).send({message: "Error in showing Specialties table"});
            return;
        }
        console.log("Showing Specialties table");
        res.send(mySQLres);
    })
}

const DropSpecialtiesTable = (req, res) => {
    const Q = "DROP TABLE specialties";
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error in dropping specialties table ", err);
            res.status(400).send({message: "Error on dropping specialties table" + err});
            return;
        }
        console.log("specialties table dropped");
        res.send("Specialties table dropped");
    })
}

// ################################## REVIEWS ###############################

const CreateReviewsTable = (req, res) => {
    const Q = 'CREATE TABLE IF NOT EXISTS reviews (therapistId int, userName varchar(50), reviewDate datetime, reviewText varchar(300), isAnonymous boolean, rating real, primary key (therapistId, userName, reviewDate), foreign key (therapistId) references web.therapists (therapistId), foreign key (userName) references web.users (userName))';
    SQL.query(Q, (err, sqlUsers) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "Error in creating reviews table"});
            return;
        }
        console.log('created reviews table');
        res.send("Reviews table created");
    });
}

const InsertReviews = (req, res) => {
    const Q = "INSERT IGNORE INTO reviews SET ?";
    const csvFilePath = path.join(__dirname, "reviews.csv");
    csv().fromFile(csvFilePath).then((jsonObj) => {
        jsonObj.forEach(element => {
            const review = new Review(parseInt(element.therapistId), element.userName, new Date(element.reviewDate), element.reviewText, (element.isAnonymous.toUpperCase() === 'TRUE'), parseFloat(element.rating))
            SQL.query(Q, review, (err) => {
                if (err) {
                    console.log("error in inserting data", err);
                    return
                }
                console.log("created review row successfully");
            });
        });
    })
    res.send('Data inserted to Specialties table');
};

const ShowReviewsTable = (req, res) => {
    const Q = "SELECT * FROM reviews";
    SQL.query(Q, (err, mySQLres) => {
        if (err) {
            console.log("error in showing reviews table ", err);
            res.status(400).send({message: "Error in showing Reviews table"});
            return;
        }
        console.log("Showing Reviews table");
        res.send(mySQLres);
    })
};

const DropReviewsTable = (req, res) => {
    const Q = "DROP TABLE reviews";
    SQL.query(Q, (err) => {
        if (err) {
            console.log("error in dropping reviews table ", err);
            res.status(400).send({message: "Error on dropping reviews table" + err});
            return;
        }
        console.log("reviews table dropped");
        res.send("Reviews table dropped");
    })
}

// ################################## ALL TABLES ###############################

const DropAllTables = (req, res) => {
    const Q = 'DROP TABLE IF EXISTS specialties, reviews, therapists, users';
    SQL.query(Q, (err, sqlUsers) => {
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "Error in dropping all tables"});
            return;
        }
        console.log('dropped all tables');
        res.send("All tables dropped");
    })
}

module.exports = {
    CreateTherapistsTable, InsertTherapists, ShowTherapistTable, DropTherapistTable,
    CreateUsersTable, InsertUsers, ShowUsersTable, DropUsersTable,
    CreateSpecialtiesTable, InsertSpecialties, ShowSpecialtiesTable, DropSpecialtiesTable,
    CreateReviewsTable, InsertReviews, ShowReviewsTable, DropReviewsTable,
    DropAllTables
};