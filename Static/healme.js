//################################### GOOGLE MAPS API ###################################
let map;
let geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 31.715715, lng: 34.991453},
        zoom: 7,
    });
    geocoder = new google.maps.Geocoder();
    for (const therapist of getTherapistsList()) {
        addAddressMarker(therapist)
    }
}

function getAddressCoordinates(address) {
    return geocoder.geocode({address: address}).then((result) => {
        return result.results[0].geometry.location;
    }).catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
    });
}

function getCoordinateAddress(lat, lng) {
    return geocoder.geocode({address: `${lat}, ${lng}`}).then((result) => {
        return result.results[0].formatted_address;
    }).catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
    });
}

function addAddressMarker(therapist) {
    getAddressCoordinates(therapist.address).then(result => {
        new google.maps.Marker({
            position: result,
            map,
            title: getFullName(therapist),
        });
    }).catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
    });
}

function degToRad(x) {
    return x * Math.PI / 180;
}

//Calculate the distance between two points on the map
function calcDistance(p1, p2) {
    const R = 6378137 / 1000; // Earth’s mean radius in KM
    const dLat = degToRad(p2.lat() - p1.lat());
    const dLong = degToRad(p2.lng() - p1.lng());
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(p1.lat())) * Math.cos(degToRad(p2.lat())) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // returns the distance in meter
}

window.initMap = initMap;


//################################### THERAPIST ###################################
const GENDER = {
    MALE: 0,
    FEMALE: 1
}

class Therapist {
    constructor(id, fname, lname, gender, specialties, address, website, phone, description) {
        this.id = id;
        this.firstName = fname;
        this.lastName = lname;
        this.gender = gender;
        this.specialties = specialties;
        this.address = address;
        this.website = website;
        this.phone = phone;
        this.description = description;
    }
}

function initTherapists() {
    if (!localStorage.getItem('therapistsList')) {
        localStorage.setItem('therapistsList', JSON.stringify(therapistList))
    }
}

function getTherapistsList() {
    if (localStorage.getItem('therapistsList')) {
        return JSON.parse(localStorage.getItem('therapistsList'));
    } else {
        return [];
    }
}

function getTherapistById(id) {
    return getTherapistsList().find(t => t.id === id);
}

//Default therapists list
const therapistList = [
    new Therapist(1, "Avital", "Pritzki", GENDER.FEMALE, ["Athlete's Massage", "Medical Massage", "Deep Tissue Massage", "Swedish Massage", "Reflexology"], "Hebron Rd 10, Jerusalem", "https://www.healthyclick.co.il", "0549447997", ""),
    new Therapist(2, "Alice", "Elbaz", GENDER.FEMALE, ["Athlete's Massage", "Deep Tissue Massage", "Reflexology", "Lymphatic Massage", "Massage For Pregnant Women", "Facial Massage", "Edge Massage", "Shiatsu "], "Mivtsa Harel St 10, Rosh Haayin", "https://www.youtube.com/user/alice120375", "0535550002", "I am Alice, a certified therapist in a variety of methods, the owner of the clinic \"Alicia Energetic Therapy\" in Rosh Ha'Ain. In my work, I treat the body as a soul and handle a variety of treatments aimed at creating balance in the person."),
    new Therapist(3, "Efrat", "Dahan", GENDER.FEMALE, ["Acupuncture", "Cupping Therapy", "Hopi Candles", "Bach Flowers", "Medical Herbs", "Kinesio Taping", "Kinesiology", "Chinese Herbal Medicine"], "Kfar Adumim", "https://www.healthyclick.co.il", "0504830750", "Hello, I have been practicing complementary medicine since 1995. I specialize in Chinese medicine, nutrition, and herbs. In addition, I also handle nlp, emp, eft, and spiritual counseling."),
    new Therapist(4, "Tamir", "Goldenberg", GENDER.MALE, ["Acupuncture", "Twina"], "Lotus St 20, Haifa", "", " ", "0503478546", "Acupuncture therapist / Tuina / herbs / nutrition men/women/children-babies"),
    new Therapist(5, "Yoel", "Shnior", GENDER.MALE, ["Twina", "Homeopathy", "Naturopathy", "Hopi Candles", "Medical Massage", "Bach Flowers", "Medical Herbs", "Reflexology", "Shiatsu"], "Ruppin St 43, Kfar Saba", "", "0526200352", "I was born with visual impairment and have been treating mainly contact therapies for 30 years. Works with KPF Leumit and the insurance companies."),
    new Therapist(6, "Aaron", "Weingarten", GENDER.MALE, ["Acupuncture", "Medical Massage", "Rehabilitative Massage", "Combined Oil Massage", "Couples Massage", "Massage For Pregnant Women", "Cupping Therapy", "Tens", "Shiatsu", "Rayonex Frequency Treatment", "Medical Leech Treatment", "Reiki", "Shock Waves", "Pressure Suit"], "Ramat Gan", "https://www.harydoc.com/", "0722285782", "In the treatment, first I perform a diagnosis and scan the patient, then adjust the most suitable treatment methods that will treat the problems. Combines several methods as needed and consults with doctors who know the patients for the best treatment."),
    new Therapist(7, "Yael", "Geva", GENDER.FEMALE, ["The Feldenkrais Method"], " Lachish ", "https://www.healthyclick.co.il", "0507988385", "Feldenkrais treats adults suffering from back and joint pain and more, babies and children with developmental delays. Children with Special Needs"),
    new Therapist(8, "Bella", "Bookstein", GENDER.FEMALE, ["Acupressure", "Aromatherapy", "Naturopathy", "Hot Stone Massage", "Couple's Massage", "Event Massage", "Lymphatic Massage", "Massage for Pregnant Women", "Edge Massage", "Medical Massage", "Deep Tissue Massage", "Swedish Massage", "Thai Massage", "Baby Massage", "Bach Flowers", "Medical Herbs", "Reiki", "Western Herbal Medicine", "Reflexology", "Shiatsu"], "Beer Sheva", "https://www.healthyclick.co.il", "0527564865", "Treats with a variety of methods, experience over 10 years"),
    new Therapist(9, "Michal", "Schlesinger", GENDER.FEMALE, ["Acupuncture", "Bach Flowers", "Western Herbal Medicine", "Chinese Herbal Medicine", "Shiatsu"], "Rosh HaAyin", "https://www.healthyclick.co.il", "0527564865", "Holistic natural health. Combines Chinese medicine alongside other methods to provide a complete answer body-mind-spirit. Bioergonomics, recall healing, spiritual psychotherapy, constellation, AIPAC, reconstruction of incarnations and more..."),
    new Therapist(10, "Yonet ", "Ziegert", GENDER.FEMALE, ["Homeopathy"], "Shoham", "https://www.healthyclick.co.il", "0526178141", "Treats adults and children with classical homeopathy"),
]

//List of all Specialties
const specialtiesList =
    ["Athlete's Massage", "Medical Massage", "Lymphatic Massage", "Massage For Pregnant Women",
        "Facial Massage", "Edge Massage", "Shiatsu",
        "Acupuncture", "Hopi Candles", "Bach Flowers", "Kinesio Taping", "Kinesiology", "Twina",
        "Homeopathy", "Naturopathy", "Acupuncture", "rehabilitative massage", "combined oil massage",
        "couples massage", "Cupping Therapy", "tens", "rayonex frequency treatment",
        "medical leech treatment", "reiki", "shock waves", "pressure suit", "The Feldenkrais method",
        "Aromatherapy", "Hot Stone Massage", "Couple's Massage", "Event Massage", "Deep Tissue Massage",
        "Swedish Massage", "Thai Massage", "Baby Massage", "medical herbs", "Reiki", "Reflexology",
        "Western Herbal Medicine", "Chinese HerbalMedicine"]

//################################### USER ###################################
class User {
    constructor(fname, lname, email, uname, pass) {
        this.firstName = fname;
        this.lastName = lname;
        this.email = email;
        this.username = uname;
        this.password = pass;
    }
}

function initUsers() {
    if (!localStorage.getItem('usersList')) {
        localStorage.setItem('usersList', JSON.stringify(usersList))
    }
}

function getUsersList() {
    if (localStorage.getItem('usersList')) {
        return JSON.parse(localStorage.getItem('usersList'));
    } else {
        return [];
    }
}

function registerUser(user) {
    if (localStorage.getItem('usersList')) {
        const usersList = JSON.parse(localStorage.getItem('usersList'));
        usersList.push(user);
        localStorage.setItem('usersList', JSON.stringify(usersList));
    }
}

function updateUser(updatedUser) {
    let found = false;
    if (localStorage.getItem('usersList')) {
        const usersList = JSON.parse(localStorage.getItem('usersList'));
        for (const user of usersList) {
            if (user.username === updatedUser.username) {
                user.firstName = updatedUser.firstName;
                user.lastName = updatedUser.lastName;
                user.email = updatedUser.email;
                found = true;
                break;
            }
        }
        if (found) {
            localStorage.setItem('usersList', JSON.stringify(usersList));
        }
    }
    return found;
}

function initLoggedUser() {
    if (localStorage.getItem('loggedUser')) {
        loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    } else {
        loggedUser = undefined;
    }
}

function logIn(user) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    loggedUser = user;
}

function logOut() {
    localStorage.removeItem('loggedUser');
    loggedUser = undefined;
}

function isLoggedIn() {
    return loggedUser !== undefined;
}

//Default users list
const usersList = [
    new User("Or", "Steinmetz", "or17121999@gmail.com", "orbab", "1234"),
    new User("Elad", "Steinmetz", "eladsteinmetz0@gmail.com", "eladst", "1234"),
    new User("Neta", "Sadi", "netas@gmail.com", "netas", "1234")
];


//################################### REVIEW ###################################
class Review {
    constructor(therapistId, user, date, text, isAnonymous, rating) {
        this.therapistId = therapistId;
        this.user = user;
        this.date = date;
        this.text = text;
        this.isAnonymous = isAnonymous;
        this.rating =rating;
    }
}

function initReviews() {
    if (!localStorage.getItem('reviewList')) {
        localStorage.setItem('reviewList', JSON.stringify(reviewList))
    }
}

function getReviewList() {
    if (localStorage.getItem('reviewList')) {
        return JSON.parse(localStorage.getItem('reviewList'));
    } else {
        return [];
    }
}

function saveReviewsList(reviewsList) {
    localStorage.setItem('reviewList', JSON.stringify(reviewsList))
}

function deleteReview(review) {
    let reviewsList = getReviewList();
    const index = reviewsList.findIndex(r => r.user === review.user && r.therapistId === review.therapistId && r.date === review.date);
    if (index !== -1) {
        reviewsList.splice(index, 1)
    }
    saveReviewsList(reviewsList)
}

function addNewReview(review) {
    const reviewsList = getReviewList();
    reviewsList.push(review);
    saveReviewsList(reviewsList);
}

function getTherapistReviews(therapistId) {
    const therapistReviews = [];
    for (const review of getReviewList()) {
        if (review.therapistId === therapistId) {
            therapistReviews.push(review);
        }
    }
    return therapistReviews;
}

function getTherapistAverageRating(therapistId) {
    const therapistReviews = getTherapistReviews(therapistId);
    let therapistAverage = 0;
    for (const review of therapistReviews) {
        therapistAverage += review.rating;
    }
    return round(therapistAverage / therapistReviews.length, 1);
}

function getUserReviews(username) {
    const userReviews = [];
    for (const review of getReviewList()) {
        if (review.user === username) {
            userReviews.push(review);
        }
    }
    return userReviews;
}

function getReviewByIdentifier(username, therapistId, date) {
    for (const review of getReviewList()) {
        if (review.user === username && review.therapistId === therapistId && review.date === date) {
            return review;
        }
    }
    return null;
}

//Default Reviews list
const reviewList = [
    new Review(1,"orbab",new Date ('2022-12-12'),"amazing therapist, helped me so much",false, 5),
    new Review(2,"orbab",new Date ('2020-11-08'),"this therapist helped me a lot, but there are no good transportation to his place",false, 3),
    new Review(4,"orbab",new Date ('2022-01-03'),"he is a good therapist, he really tried to help me but my pain wasn't reduced as i hoped",true, 2),
    new Review(8,"orbab",new Date ('2022-04-21'),"the best therapist i could hope for! saves my life",false, 5),
    new Review(10,"orbab",new Date ('2021-07-14'),"the best therapist i could hope for! saves my life",false, 5),
    new Review(10,"netas",new Date ('2022-06-14'),"amazing therapist, helped me so much",false, 4),
    new Review(4,"netas",new Date ('2022-10-14'),"amazing therapist, completely changed my life for the better",false, 5),
    new Review(7,"netas",new Date ('2021-12-02'),"good therapist, thanks to him i was able to work again",false, 5),
    new Review(3,"netas",new Date ('2020-12-09'),"im sure this therapist isn't that bad, however my Experience with him wasn't positive at all",false, 2),
    new Review(5,"netas",new Date ('2022-09-23'),"i had a very positiveExperience with this therapist, highly recommended",false, 5),
    new Review(9,"eladst",new Date ('2022-09-23'),"amazing therapist, helped me so much",false, 4),
    new Review(7,"eladst",new Date ('2022-07-28'),"literally saved my life",false, 5),
    new Review(8,"eladst",new Date ('2021-05-21'),"the therapist was very professional but there was no chemistry between us",false, 3),
    new Review(1,"eladst",new Date ('2022-08-16'),"the therapist was very professional highly recommended",false, 5),
    new Review(6,"eladst",new Date ('2021-03-18'),"the therapist was very kind to me' help me a lot physically and emotionally",false, 5),
]

//################################### MAIN SITE FUNCTIONALITY ###################################

//The currently logged-in user
let loggedUser;

//Get the current page
const currentPage = window.location.pathname.split('/').pop();
console.log(currentPage);

//Initialize all required lists and objects
initReviews();
initTherapists();
initUsers();
initLoggedUser();
if (currentPage !== 'write-review-page.html') {
    //Handle profile page and log-in buttons
    if (!isLoggedIn()) {
        document.getElementById('nav-profile-btn').classList.add('hidden');
        document.getElementById('log-reg-icon').innerHTML = 'login';
        document.getElementById('log-reg-text').innerHTML = 'Log In';
        document.getElementById('log-link').href = './login-page.html';
    } else {
        document.getElementById('nav-profile-btn').classList.remove('hidden');
        document.getElementById('log-reg-icon').innerHTML = 'logout';
        document.getElementById('log-reg-text').innerHTML = 'Log Out';
        document.getElementById('log-link').href = './logout-page.html';
    }
}

//Initialize current page
switch (currentPage) {
    case 'home-page.html':
        document.getElementById('nav-home-btn').classList.add('bold');
        initHomePage();
        break;
    case 'login-page.html':
        if (isLoggedIn()) {
            redirectToPage('./home-page.html');
        } else {
            initLoginPage()
        }
        break;
    case 'logout-page.html':
        if (!isLoggedIn()) {
            redirectToPage('./home-page.html');
        } else {
            initLogoutPage()
        }
        break;
    case 'register-page.html':
        if (isLoggedIn()) {
            redirectToPage('./home-page.html');
        } else {
            initRegisterPage()
        }
        break;
    case 'search-page.html':
        document.getElementById('nav-search-btn').classList.add('bold');
        initSearchPage();
        break;
    case 'healer-profile-page.html':
        document.getElementById('nav-search-btn').classList.add('bold');
        initHealerProfilePage();
        break;
    case 'write-review-page.html':
        initWriteReviewPage();
        break;
    case 'profile-page.html':
        if (!isLoggedIn()) {
            redirectToPage('./home-page.html');
        } else {
            document.getElementById('nav-profile-btn').classList.add('bold');
            initProfilePage();
        }
        break;
}

function initHomePage() {
    const registerBtn = document.getElementById('register-btn');
    //If the user is logged in, hide the 'Register' button
    if (isLoggedIn()) {
        registerBtn.classList.add('hidden');
    }
}

function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error-msg');
    const errorMsgText = document.getElementById('login-error-msg-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const usernameInput = loginForm.elements.namedItem('uname');
    const passwordInput = loginForm.elements.namedItem('pswd');
    const onSubmitLoginForm = async (e) => {
        e.preventDefault();
        const usersList = getUsersList();
        //Find if the user exists in the DB
        for (const user of usersList) {
            if (user.username === usernameInput.value && user.password === passwordInput.value) {
                logIn(user);
                break;
            }
        }
        if (isLoggedIn()) {
            //Log in was successful
            errorMsgText.innerHTML = 'Logged In Successfully!';
            errorMsg.classList.add('form-success-msg');
            loadingSpinner.classList.remove('hidden');
            await delay(3000);
            redirectToPage('./profile-page.html');
        } else {
            //Log in was unsuccessful
            errorMsgText.innerHTML = 'Invalid login';
            errorMsg.classList.add('form-error-msg');
        }
    }
    loginForm.addEventListener('submit', onSubmitLoginForm)
}

function initLogoutPage() {
    const logoutBtn = document.getElementById('logout-btn');
    const onLogoutClick = (e) => {
        e.preventDefault();
        logOut();
        redirectToPage('./home-page.html');
    }
    logoutBtn.addEventListener('click', onLogoutClick)
}

function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    const errorMsg = document.getElementById('register-error-msg');
    const errorMsgText = document.getElementById('register-error-msg-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const firstNameInput = registerForm.elements.namedItem('fname');
    const lastNameInput = registerForm.elements.namedItem('lname');
    const emailInput = registerForm.elements.namedItem('email');
    const usernameInput = registerForm.elements.namedItem('uname');
    const passwordInput = registerForm.elements.namedItem('pswd');
    const onSubmitRegisterForm = async (e) => {
        e.preventDefault();
        //Construct new User object from input values
        const newUser = new User(
            firstNameInput.value,
            lastNameInput.value,
            emailInput.value,
            usernameInput.value,
            passwordInput.value);
        const usersList = getUsersList();
        let found = false;
        //Find if the username already exists or the email is already registered
        for (const user of usersList) {
            if (user.username === newUser.username) {
                errorMsgText.innerHTML = 'Username already exists';
                found = true;
                break;
            }
            if (user.email === newUser.email) {
                errorMsgText.innerHTML = 'Email is already registered';
                found = true;
                break;
            }
        }
        if (found) {
            errorMsg.classList.add('form-error-msg');
        } else {
            //Register was successful
            registerUser(newUser);
            errorMsgText.innerHTML = 'Registration completed!';
            errorMsg.classList.add('form-success-msg');
            loadingSpinner.classList.remove('hidden');
            await delay(3000);
            redirectToPage('./login-page.html');
        }
    }
    registerForm.addEventListener('submit', onSubmitRegisterForm)
}

function initSearchPage() {
    //Get the therapist template from HTML and then delete it
    const resultsList = document.getElementById('results-container');
    const template = htmlToElement(resultsList.innerHTML)
    resultsList.innerHTML = '';

    //Initialize specialties options
    const specialtiesListElement = document.getElementById('specialties');
    for (const specialty of specialtiesList) {
        const spOption = document.createElement('option');
        spOption.value = specialty;
        specialtiesListElement.appendChild(spOption)
    }

    //If we returned to this search from a healer profile page, get the parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchSpecialty = urlParams.get('specialty');
    const searchLocation = urlParams.get('location');

    const searchForm = document.getElementById('search-form');
    const specialtyInput = searchForm.elements.namedItem('specialty');
    if (searchSpecialty !== '') {
        specialtyInput.value = searchSpecialty;
    }
    const locationInput = searchForm.elements.namedItem('location');
    if (searchLocation !== '') {
        locationInput.value = searchLocation;
    }
    const slider = document.getElementById("radius-slider");
    const output = document.getElementById("radius-output");
    output.innerHTML = Math.floor(1 + (49 * (slider.value / 100))); // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = Math.floor(1 + (49 * (this.value / 100)))
    }

    const onSubmitSearch = (e) => {
        if (e !== undefined) {
            e.preventDefault();
        }
        resultsList.innerHTML = ''; //Reset results list
        const radius = Math.floor(1 + (49 * (slider.value / 100))) //Get current selected radius
        //Search cases handling
        if (locationInput.value !== '' && specialtyInput.value !== '') { //If the user input both specialty and location, search by both
            getAddressCoordinates(locationInput.value).then(result => { //Gets the coordinates of the input address
                //Display map around the input location
                map.setCenter(result)
                map.setZoom(Math.round(20 - (15 * (radius / 50))));
                //Find a therapist that matches the selected specialty
                for (const therapist of getTherapistsList()) {
                    if (therapist.specialties.find(sp => sp.toLowerCase() === specialtyInput.value.toLowerCase()) !== undefined) {
                        getAddressCoordinates(therapist.address).then(therapistResult => { //Gets the coordinates pf therapist address
                            //Check if therapist is in selected radius
                            const distance = calcDistance(result, therapistResult)
                            if (distance <= radius) {
                                //Add the therapist to results list
                                addTherapistToList(resultsList, template, therapist, specialtyInput.value, locationInput.value);
                            }
                        }).catch((e) => {
                            alert("Geocode was not successful for the following reason: " + e);
                        });
                    }
                }
            }).catch((e) => {
                alert("Geocode was not successful for the following reason: " + e);
            });
        } else if (locationInput.value === '' && specialtyInput.value !== '') { //If the user only chose specialty and not location
            //Reset map to Israel
            map.setCenter({lat: 31.715715, lng: 34.991453});
            map.setZoom(7);
            //Find therapist by selected specialty
            for (const therapist of getTherapistsList()) {
                if (therapist.specialties.find(sp => sp.toLowerCase() === specialtyInput.value.toLowerCase()) !== undefined) {
                    //Add the therapist to the results list
                    addTherapistToList(resultsList, template, therapist, specialtyInput.value, locationInput.value);
                }
            }
        } else if (locationInput.value !== '' && specialtyInput.value === '') { //If the user on chose location and not specialty
            getAddressCoordinates(locationInput.value).then(result => { //Gets the coordinates for the input location
                //Display map around the input location
                map.setCenter(result)
                map.setZoom(Math.round(20 - (15 * (radius / 50))));
                //Find therapist in the selected radius from the location
                for (const therapist of getTherapistsList()) {
                    getAddressCoordinates(therapist.address).then(therapistResult => { //Gets the coordinates of the therapist location
                        //Check if the therapist is in the selected radius
                        const distance = calcDistance(result, therapistResult)
                        if (distance <= radius) {
                            //Add therapist to results list
                            addTherapistToList(resultsList, template, therapist, specialtyInput.value, locationInput.value);
                        }
                    }).catch((e) => {
                        alert("Geocode was not successful for the following reason: " + e);
                    });
                }
            }).catch((e) => {
                alert("Geocode was not successful for the following reason: " + e);
            });
        }

    }
    searchForm.addEventListener('submit', onSubmitSearch)

    const currentLocBtn = document.getElementById('current-location-btn');
    const onCurrentLocBtnClick = (e) => {
        //Get the current location and set the location input to it
        e.preventDefault()
        navigator.geolocation.getCurrentPosition(function(position){ //Gets the current location in coordinates
            const currentLatitude = position.coords.latitude;
            const currentLongitude = position.coords.longitude;
            getCoordinateAddress(currentLatitude, currentLongitude).then(result => { //Gets the address from the current coordinates
                locationInput.value = result;
            }).catch((e) => {
                alert("Geocode was not successful for the following reason: " + e);
            });
        });
    }
    currentLocBtn.addEventListener('click', onCurrentLocBtnClick)
}

//Add the therapist to the results list by the therapist template
function addTherapistToList(listElement, template, therapist, searchSpecialty, searchLocation) {
    let div = template.outerHTML;
    //Replace placeholders in the text with the therapist information
    if (therapist.gender === 0) {
        div = div.replace('business-woman.png', 'business-man.png')
    }
    div = div.replace('NAME_PLACEHOLDER', getFullName(therapist))
    div = div.replace('SPECIALTIES_PLACEHOLDER', arrayToString(therapist.specialties))
    div = div.replace('LOCATION_PLACEHOLDER', therapist.address)
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(getTherapistAverageRating(therapist.id))) {
            div = div.replace(`star${i}`, 'checked')
        }
    }
    div = div.replace('RATING_PLACEHOLDER', getTherapistAverageRating(therapist.id))
    div = div.replace('ID_PLACEHOLDER', therapist.id)
    div = div.replace('SEARCH_SPECIALTY_PLACEHOLDER', searchSpecialty)
    div = div.replace('SEARCH_LOCATION_PLACEHOLDER', searchLocation)

    //Add the HTML string to the list element inner HTML, so it will display in the results list
    listElement.innerHTML += div;
}

function initHealerProfilePage() {
    //Get the therapist ID from URL parameters, and the search and location so we can return to search
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const therapistId = urlParams.get('therapist')
    const searchSpecialty = urlParams.get('specialty');
    const searchLocation = urlParams.get('location');
    console.log(therapistId);

    //Get the selected therapist
    const therapist = getTherapistsList().find(t => t.id === JSON.parse(therapistId));

    //Set the return button list to add the location and specialty of the previous search
    document.getElementById('return-search-btn').href = `search-page.html?location=${searchLocation}&specialty=${searchSpecialty}`;

    //Set document attributes to reflect therapist information
    if (therapist.gender === GENDER.MALE) {
        document.getElementById('healer-image').src = '../Static/Images/business-man.png';
    } else {
        document.getElementById('healer-image').src = '../Static/Images/business-woman.png';
    }
    document.getElementById('healer-name').innerHTML = getFullName(therapist);
    document.getElementById('haeler-specialties').innerHTML = arrayToString(therapist.specialties);
    document.getElementById('healer-location').innerHTML = therapist.address;
    document.getElementById('healer-desc').innerHTML = therapist.description;
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(getTherapistAverageRating(JSON.parse(therapistId)))) {
            document.getElementById(`star${i}`).classList.add('checked');
        }
    }
    document.getElementById('healer-rating').innerHTML = getTherapistAverageRating(JSON.parse(therapistId));
    if (therapist.phone === '' && therapist.website === '') {
        document.getElementById('information-container').hidden = true;
    } else {
        document.getElementById('information-container').hidden = false;
        if (therapist.phone !== '') {
            document.getElementById('phone-container').hidden = false;
            document.getElementById('healer-phone').innerHTML = therapist.phone;
        } else {
            document.getElementById('phone-container').hidden = true;
        }
        if (therapist.website !== '') {
            document.getElementById('healer-website').hidden = false;
            document.getElementById('healer-website').href = therapist.website;
            document.getElementById('healer-website').getElementsByTagName('p').item(0).innerHTML = therapist.website;
        } else {
            document.getElementById('healer-website').hidden = true;
        }
    }

    //Init therapist reviews
    const therapistReviews = getTherapistReviews(therapist.id);

    //Get review template from HTML
    const reviewsList = document.getElementById('reviews-container');
    const template = htmlToElement(reviewsList.innerHTML)
    reviewsList.innerHTML = '';

    //Add all reviews to review list
    for (const review of therapistReviews) {
        addReviewToList(reviewsList, template, review);
    }

    const writeReviewBtn = document.getElementById('write-review-btn');
    const onWriteReviewClick = (e) => {
        e.preventDefault();
        //Open 'Write a Review' in new window
        const writeReviewWindow = window.open(`write-review-page.html?therapist=${therapist.id}`,'name','width=600,height=400')
        writeReviewWindow.addEventListener('beforeunload', function (event) {
            //When the window closes, reload the therapist profile page to load the new review
            reloadPage();
        })
    };
    writeReviewBtn.addEventListener('click', onWriteReviewClick);
}

//Add a review to the reviews list by the review template
function addReviewToList(listElement, template, review) {
    let div = template.outerHTML;
    //Replace placeholders in the text with the review information
    if (review.isAnonymous) {
        div = div.replace('USERNAME_PLACEHOLDER', 'Anonymous User');
    } else {
        div = div.replace('USERNAME_PLACEHOLDER', review.user);
    }
    div = div.replace('THERAPIST_PLACEHOLDER', getFullName(getTherapistById(review.therapistId)));
    div = div.replace('DELETE_BUTTON_PLACEHOLDER', `${getReviewIdentifier(review)}_delete_btn`);

    div = div.replace('TEXT_PLACEHOLDER', review.text);
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(review.rating)) {
            div = div.replace(`star${i}`, 'checked')
        }
    }

    //Add the HTML string to the list element inner HTML, so it will display in the reviews list
    listElement.innerHTML += div;
}

function initWriteReviewPage() {
    //Get the therapist ID from the URL parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const therapistId = urlParams.get('therapist');

    //Set username
    const usernameLabel = document.getElementById('username-label')
    usernameLabel.innerHTML = loggedUser.username;

    const reviewForm = document.getElementById('review-form');
    const reviewText = reviewForm.elements.namedItem('review-area');
    const anonCheckbox = reviewForm.elements.namedItem('anonymous-checkbox');

    const ratingStars = document.querySelectorAll('input[name="rating"]');

    anonCheckbox.addEventListener('change', (event) => {
        //Change displayed username to anonymous if the checkbox is selected
        if (event.currentTarget.checked) {
            usernameLabel.innerHTML = 'Anonymous User';
        } else {
            usernameLabel.innerHTML = loggedUser.username;
        }
    })

    const onReviewSubmit = (e) => {
        e.preventDefault();
        //Calculate the rating
        let rating = 0;
        for (const ratingStar of ratingStars) {
            if (ratingStar.checked) {
                rating = JSON.parse(ratingStar.value);
                break;
            }
        }
        //Create a new review and add it
        const newReview = new Review(JSON.parse(therapistId), loggedUser.username, new Date(), reviewText.value, anonCheckbox.checked, rating);
        addNewReview(newReview);
        //Close the 'Write a Review' window
        closeWindow();
    };

    reviewForm.addEventListener('submit', onReviewSubmit)
}

function initProfilePage() {
    //Set the full name of the user
    const welcomeHeader = document.getElementById('welcome-header');
    welcomeHeader.innerHTML = `Welcome, ${getFullName(loggedUser)}`;

    const updateForm = document.getElementById('update-form');
    const firstNameInput = updateForm.elements.namedItem('fname');
    const lastNameInput = updateForm.elements.namedItem('lname');
    const emailInput = updateForm.elements.namedItem('email');
    const updateBtn = document.getElementById('update-btn');
    const saveBtn = document.getElementById('save-btn');

    //Resets the update form to default values and disable the save button
    const resetUpdateForm = (e) => {
        if (e !== undefined) {
            e.preventDefault()
        }
        firstNameInput.value = loggedUser.firstName;
        lastNameInput.value = loggedUser.lastName;
        emailInput.value = loggedUser.email;
        firstNameInput.disabled = true;
        lastNameInput.disabled = true;
        emailInput.disabled = true;
        saveBtn.disabled = true;
        updateBtn.getElementsByClassName('btn-text').item(0).innerHTML = 'Update';
        updateBtn.removeEventListener('click', resetUpdateForm);
        updateBtn.removeEventListener('click', onUpdateBtnClick);
        updateBtn.addEventListener('click', onUpdateBtnClick);
    }
    //Disable the input fields and save button
    const onUpdateBtnClick = (e) => {
        e.preventDefault()
        firstNameInput.disabled = false;
        lastNameInput.disabled = false;
        emailInput.disabled = false;
        saveBtn.disabled = false;
        updateBtn.getElementsByClassName('btn-text').item(0).innerHTML = 'Cancel';
        updateBtn.removeEventListener('click', onUpdateBtnClick);
        updateBtn.addEventListener('click', resetUpdateForm);
    }
    //Submit the new details and update the user
    const onSubmitUpdateForm = (e) => {
        e.preventDefault();
        //Create the updated user
        const newUser = new User(
            firstNameInput.value,
            lastNameInput.value,
            emailInput.value,
            loggedUser.username,
            loggedUser.password);
        updateUser(newUser);
        logIn(newUser); //Log in the new user to save the updated information
        reloadPage(); //Reload the page to see new information
    }

    //By default, reset the update form to disable the input fields and save button
    resetUpdateForm();
    updateForm.addEventListener('submit', onSubmitUpdateForm)

    //Delete a review function
    const onDeleteReviewClick = (e) => {
        e.preventDefault();
        const reviewIdentifiers = e.currentTarget.id.split('_')
        const review = getReviewByIdentifier(reviewIdentifiers[0], JSON.parse(reviewIdentifiers[1]), reviewIdentifiers[2]);
        deleteReview(review);
        reloadPage();
    }

    //Initialize all User reviews
    const userReviews = getUserReviews(loggedUser.username);

    //Gets the Review template from HTML and delete it
    const reviewsList = document.getElementById('reviews-container');
    const template = htmlToElement(reviewsList.innerHTML)
    reviewsList.innerHTML = '';

    //Add all reviews to reviews list
    for (const review of userReviews) {
        addReviewToList(reviewsList, template, review);
    }
    //Link all delete review buttons
    for (const review of userReviews) {
        const reviewIdentifier = getReviewIdentifier(review);
        document.getElementById(`${reviewIdentifier}_delete_btn`).addEventListener('click', onDeleteReviewClick)
    }
}

//################################### MISC. FUNCTIONS ###################################

function redirectToPage(page) {
    window.location.href = page;
}

function reloadPage() {
    window.location.reload()
}

function closeWindow() {
    window.close();
}

function getFullName(object) {
    return `${object.firstName} ${object.lastName}`
}

function getReviewIdentifier(review) {
    return `${review.user}_${review.therapistId}_${review.date}`
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
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

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}