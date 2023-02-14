const GENDER = {
    MALE: 0,
    FEMALE: 1
}

class User {
    constructor(fname, lname, email, uname, pass) {
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;
        this.userName = uname;
        this.userPassword = pass;
    }
}

class Therapist {
    constructor(id, fname, lname, gender, address, website, phone, description) {
        this.therapistId = id;
        this.firstName = fname;
        this.lastName = lname;
        this.gender = gender;
        this.address = address;
        this.website = website;
        this.phone = phone;
        this.therapistDescription = description;
    }
}

class Review {
    constructor(therapistId, user, date, text, isAnonymous, rating) {
        this.therapistId = therapistId;
        this.userName = user;
        this.reviewDate = date;
        this.reviewText = text;
        this.isAnonymous = isAnonymous;
        this.rating = rating;
    }
}

module.exports = {GENDER, User, Therapist, Review}