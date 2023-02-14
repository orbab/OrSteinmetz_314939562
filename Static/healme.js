//################################### GOOGLE MAPS API ###################################
let map;
let geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 31.715715, lng: 34.991453},
        zoom: 7,
    });
    geocoder = new google.maps.Geocoder();
    fetch('/getTherapistsMarkers').then(data => {return data.json()}).then(res => {
        res.forEach(therapist => addAddressMarker(therapist))
    }).catch(err => {
        console.log('Error fetching therapists: ' + err)
    })
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
            title: therapist.fullName,
        });
    }).catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
    });
}

window.initMap = initMap;

//################################### MAIN SITE FUNCTIONALITY ###################################

//Get the current page
const currentPage = window.location.pathname.split('/').pop();
console.log(currentPage);

//Initialize current page
switch (currentPage) {
    case 'search':
        initSearchPage();
        break;
    case 'healer':
        initHealerProfilePage();
        break;
    case 'review':
        initWriteReviewPage();
        break;
    case 'profile':
        initProfilePage()
        break;
}

function initSearchPage() {
    //Get the therapist template from HTML and then delete it
    // const resultsList = document.getElementById('results-container');
    // const template = htmlToElement(resultsList.innerHTML)
    // resultsList.innerHTML = '';

    //Initialize specialties options
    fetch('/specialties').then(data => {return data.json()}).then(res => {
        const specialtiesListElement = document.getElementById('specialties');
        for (const specialty of res) {
            const spOption = document.createElement('option');
            spOption.value = specialty;
            specialtiesListElement.appendChild(spOption)
        }
    }).catch(err => {
        console.log('Error fetching specialties: ' + err)
    })
    const slider = document.getElementById("radius-slider");
    const output = document.getElementById("radius-output");
    output.innerHTML = Math.floor(1 + (49 * (slider.value / 100))); // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = Math.floor(1 + (49 * (this.value / 100)))
    }

    const searchForm = document.getElementById('search-form');
    const locationInput = searchForm.elements.namedItem('location');
    const currentLocBtn = document.getElementById('current-location-btn');
    const onCurrentLocBtnClick = (e) => {
        //Get the current location and set the location input to it
        e.preventDefault()
        navigator.geolocation.getCurrentPosition(function (position) { //Gets the current location in coordinates
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

function initHealerProfilePage() {
    //Get the therapist ID from URL parameters, and the search and location, so we can return to search
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const therapistId = urlParams.get('therapist')

    const writeReviewBtn = document.getElementById('write-review-btn');
    const onWriteReviewClick = (e) => {
        e.preventDefault();
        //Open 'Write a Review' in new window
        const writeReviewWindow = window.open(`review?therapist=${therapistId}`, 'name', 'width=600,height=400')
        writeReviewWindow.addEventListener('beforeunload', function (event) {
            //When the window closes, reload the therapist profile page to load the new review
            reloadPage();
        })
    };
    writeReviewBtn.addEventListener('click', onWriteReviewClick);
}

function initWriteReviewPage() {
    //Set username
    const usernameLabel = document.getElementById('username-label')
    const username = usernameLabel.innerHTML

    const reviewForm = document.getElementById('review-form');
    const anonCheckbox = reviewForm.elements.namedItem('anonymous');

    anonCheckbox.addEventListener('change', (event) => {
        //Change displayed username to anonymous if the checkbox is selected
        if (event.currentTarget.checked) {
            usernameLabel.innerHTML = 'Anonymous User';
        } else {
            usernameLabel.innerHTML = username;
        }
    })
}

function initProfilePage() {
    const updateForm = document.getElementById('update-form');
    const firstNameInput = updateForm.elements.namedItem('firstName');
    const lastNameInput = updateForm.elements.namedItem('lastName');
    const emailInput = updateForm.elements.namedItem('email');
    const btnText = document.getElementById('update-btn-text')
    const updateBtn = document.getElementById('update-btn');
    const saveBtn = document.getElementById('save-btn');

    //Resets the update form to default values and disable the save button
    const resetUpdateForm = (e) => {
        if (e !== undefined) {
            e.preventDefault()
        }
        firstNameInput.disabled = true;
        lastNameInput.disabled = true;
        emailInput.disabled = true;
        saveBtn.disabled = true;
        btnText.innerHTML = 'Update';
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
        btnText.innerHTML = 'Cancel';
        updateBtn.removeEventListener('click', onUpdateBtnClick);
        updateBtn.addEventListener('click', resetUpdateForm);
    }
    //By default, reset the update form to disable the input fields and save button
    resetUpdateForm();
}

//################################### MISC. FUNCTIONS ###################################

function redirectToPage(page) {
    window.location.href = page;
}

function reloadPage() {
    window.location.reload()
}