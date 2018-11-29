$(document).ready(function () {
  // Initialize modal
  $('.modal').modal();
 // Initialize sideNav
  $('.sidenav').sidenav();


  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyD8NvLROiMcBmHGv5tVxKjOBCm3ISO40HU",
    authDomain: "studyhall-169e6.firebaseapp.com",
    databaseURL: "https://studyhall-169e6.firebaseio.com",
    projectId: "studyhall-169e6",
    storageBucket: "studyhall-169e6.appspot.com",
    messagingSenderId: "448862351238"
  };
  firebase.initializeApp(config);
  
  // Do we need this???
  let uiConfig = {
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
      window.location.assign('<your-privacy-policy-url>');
    }
  };


  // set global variable to refer to firebase.database
  let database = firebase.database();
  // set global variable to refer to firebase authorization functions
  const auth = firebase.auth();
  // create a current user object
  let currentUserO = {
    email: "",
    uid: "",
    username: "",
    currentLocation: "none"
  }

  //when the button with an ID of log-in is pressed
  $("#log-in").on("click", function () {
    M.Sidenav.getInstance($(".sidenav")).close();
    //take the values of #email and #password with .val() and create a new user with them in firebase authorized users
    auth.signInWithEmailAndPassword($("#email").val(), $("#password").val());
    $("#email").val("");
    $("#password").val("");

  })
  
  // When sign-up is clicked (This is the sign-up button in the modal)
  $("#sign-up").on("click", function () {
    M.Sidenav.getInstance($(".sidenav")).close();
    // get the values from #email2 and #password2
    const useremail = $("#email2").val();
    const userpassword = $("#password2").val();
    console.log(useremail);
    // take the #email2 and #password2 values and create a new user in firebase authorized users
    auth.createUserWithEmailAndPassword(useremail, userpassword)
  })
  
  // When sign out is clicked
  $("#sign-out").on("click", function () {
    M.Sidenav.getInstance($(".sidenav")).close();
    // run the checkout function
    checkout();
    // hide the sign-out button and show the sign-up and log-in buttons
    $("#sign-out").addClass("hide");
    $("#log-in").removeClass("hide");
    $("#sign-up-btn").removeClass("hide");
    // sign the user out with firebase
    auth.signOut();
    
  })
  
  // when the users status changes (sign in, sign out)
  auth.onAuthStateChanged(function (firebaseUser) {
    // a variable for auth.currentUser
    let user = auth.currentUser;

    // If the user already exists 
    if (user != null) {
      // grab the current email, id and diplay name for the users
      currentUserO.email = user.email;
      currentUserO.uid = user.uid;
      let username = user.displayName;
      
      // if the username doesn't exist
      if (username == null) {
        // pull the username from the value of the form 
        username = $("#username").val();
        // update the user profile with the new username
        user.updateProfile({
          displayName: username
          //then
        }).then(function () {
          // a variable to key into the current user object in firebase
          let userRef = database.ref(`users/` + currentUserO.uid);
          // Set the current users information in the firebase object
          userRef.set({
            email: currentUserO.email,
            username: username,
            currentLocation: currentUserO.currentLocation,
          });
        });
      }
      
      // set variable for the current users information (name, email and ID)
      currentUserO.username = username;
      currentUserO.email = user.email;
      currentUserO.uid = user.uid;
      
      // a variable to key into the current user object in firebase
      let userRef = database.ref(`users/` + currentUserO.uid);
      // function to look once through the current users object in firebase
      userRef.once("value", function (snap) {
        // If the user has a value in his currenLocation 
        if (snap.val().currentLocation != null) {
          // set the users current location to the value of currenLocation
          currentUserO.currentLocation = snap.val().currentLocation;
          console.log(currentUserO.currentLocation);
          // Set the user's information to the firebase object
          userRef.set({
            email: currentUserO.email,
            username: currentUserO.username,
            currentLocation: currentUserO.currentLocation,
          });
        }
      });
      // Show the sign-out button while hiding the sign up button and the login button
      $("#sign-out").removeClass("hide");
      $("#log-in").addClass("hide");
      $("#sign-up-btn").addClass("hide");
    }
    //or else log "not logged in"
    else {
      console.log("not logged in");
      
    }
  })
  
  console.log(`Working`);
  
  // When the search button is clicked
  $("#searchButton").on("click", function () {
    M.Sidenav.getInstance($(".sidenav")).close();
    // Empty #card-container
    $("#card-container").empty();
    // Set empty latitude and longitude variables
    let latitude, longitude;
    // use getCurrentPosition to find current latitude and longitude of the user
    navigator.geolocation.getCurrentPosition(function (position) {
      // set the latitude variable to the current latitude
      latitude = position.coords.latitude;
      // set the longitude variable to the current longitude
      longitude = position.coords.longitude;
      // Our API query using latitude and longitude provided by the user to search 15 nearby coffee shops
      let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&ll=${latitude},${longitude}&query=coffee&limit=15`;
      // ajax request
      $.ajax({
        url: queryURL,
        datatype: "json",
        method: "GET",
      }).then(function (response) {
        // set a variable for our ajax response
        object = response;
        // for each response in response.response.venues
        for (i in response.response.venues) {
          // set a variable to hold the individual place name
          let name = response.response.venues[i].name;
          // set a variable to hold the individual place address
          let address = response.response.venues[i].location.formattedAddress;
          // if the address array is equal to three, include the place, otherwise skip it.
          if (address.length === 3) {
            //append the place card to the card-container
           $("#card-container").append(`
          <div class="card card-limited hoverable">
          <div data="${i}" class="card-image" href="#modal1">
          <img src="http://wptest.io/demo/wp-content/uploads/sites/2/2012/12/unicorn-wallpaper.jpg">
          <span id="place" class="card-title">${name}</span>
          </div>
          <div class="card-content paragraph">
          <div class="row">
          <div class="col s9">
          <p id="address" class="col s9">${address[0]}</p>
          </div>
          <div class="col s3">
          <a data="${i}" id="addButton" class="btn-small waves-effect waves-light red right bottom hoverable"><i class="material-icons">ADD</i></a>
          </div>
          </div>
          </div>
          </div>`)
          }
        }
      });
    });
  });

  // When card-container button addButton is clicked
  $("#card-container").on("click", "#addButton", function () {
    // if there is a current user
    if (auth.currentUser != null){
      // Save the data attribute of the addButton (current place ID)
      let venueIndex = $(this).attr("data");
      // set a variable to help push the new place to firebase database
      let venue = object.response.venues[venueIndex];
      // push the place name and address to firbase
      database.ref('places/').push({
        name: venue.name,
        address: venue.location.formattedAddress[0],
      });
    }
    // Reload the page
    location.reload();
    });
    // Set a timeout to ensure that our other code runs before this
    let buffer = setTimeout(function () {
    // when a new place is added to the database take a snapshot  
    database.ref('places/').on("child_added", function (childSnap) {
      console.log(currentUserO.currentLocation);
      console.log(childSnap.key);
      // If the current location of the user is the same as the place, append the place card to the card-container div
      if (currentUserO.currentLocation == childSnap.key) {
        $("#card-container").append(`
        <div class="card card-limited hoverable">
        <div data="${childSnap.key}" id="cardImage" class="card-image modal-trigger" href="#modal1">
        <img src="http://wptest.io/demo/wp-content/uploads/sites/2/2012/12/unicorn-wallpaper.jpg">
        <span id="place" class="card-title">${childSnap.val().name}</span>
        </div>
        <div class="card-content paragraph">
        <div class="row">
        <div class="col s9">
        <p id="address">${childSnap.val().address}</p>
        <p id="${childSnap.key}numCheckedIn">${childSnap.child('users').numChildren()} have checked in</p>
        </div>
        <div class="col s3">
        <a data="${childSnap.key}" id="checkIn${childSnap.key}" class="btn-small waves-effect waves-light red right bottom hoverable checkIn hide"><i class="material-icons">&#10003</i></a>
        <a data="${childSnap.key}" id="checkOut${childSnap.key}" class="btn-small waves-effect waves-light red right bottom hoverable checkOut"><i class="material-icons">OUT</i></a>
        </div>
        </div>
        </div>
        </div>`);

      } else {
        // Otherwise do the same thing?
        $("#card-container").append(`
        <div class="card card-limited hoverable">
        <div data="${childSnap.key}" id="cardImage" class="card-image modal-trigger" href="#modal1">
        <img src="http://wptest.io/demo/wp-content/uploads/sites/2/2012/12/unicorn-wallpaper.jpg">
        <span id="place" class="card-title">${childSnap.val().name}</span>
        </div>
        <div class="card-content paragraph">
        <div class="row">
        <div class="col s9">
        <p id="address">${childSnap.val().address}</p>
        <p id="${childSnap.key}numCheckedIn">${childSnap.child('users').numChildren()} have checked in</p>
        </div>
        <div class="col s3">
        <a data="${childSnap.key}" id="checkIn${childSnap.key}" class="btn-small waves-effect waves-light red right bottom hoverable checkIn"><i class="material-icons">&#10003</i></a>
        <a data="${childSnap.key}" id="checkOut${childSnap.key}" class="btn-small waves-effect waves-light red right bottom hoverable checkOut hide"><i class="material-icons">OUT</i></a>
        </div>
        </div>
        </div>
        </div>`);
      }
    });
  }, 500);

  // When the .checkin button inside card-container is clicked
  $("#card-container").on("click", ".checkIn", function () {
    // If there is a current user
    if (auth.currentUser != null) {
      // Set a variable to grab the data attribute of .checkin
      let venueID = $(this).attr("data");
      // Set the users current location to the previous variable
      currentUserO.currentLocation = venueID;
      // run the checkIn function
      checkIn(venueID);
      // Using the unique data attribute of the place
      database.ref(`places/${venueID}`).on("value", function (childSnap) {
        // Update the html to show how many people are currently checked in at that location
        $(`#${venueID}numCheckedIn`).text(`${childSnap.child('users').numChildren()} have checked in`)
      })
    } else{
      // Otherwise tell the user to log in
      alert(`Please log in`)
    }
    });
    // Create the checkIn function
    let checkIn = function (ID) {
      // Look into the current user's information on firebase
      database.ref(`users/${currentUserO.uid}`).once("value", function (snap) {
        // if the current user has a current location
        if (snap.val().currentLocation != null) {
          
          database.ref(`places/${snap.val().currentLocation}/users/${currentUserO.uid}`).remove()
          $(`#checkIn${snap.val().currentLocation}`).removeClass('hide');
          $(`#checkOut${snap.val().currentLocation}`).addClass('hide');
          console.log(`Delete Successful`);
          database.ref(`places/${snap.val().currentLocation}`).on("value", function (childSnap) {
            $(`#${snap.val().currentLocation}numCheckedIn`).text(`${childSnap.child('users').numChildren()} have checked in`)
          })
          database.ref(`places/${ID}/users/${currentUserO.uid}`).set(currentUserO.username);
          database.ref(`users/${currentUserO.uid}`).set({
            email: currentUserO.email,
            username: currentUserO.username,
            currentLocation: currentUserO.currentLocation,
          });
          $(`#checkIn${ID}`).addClass('hide');
          $(`#checkOut${ID}`).removeClass('hide');
        }
        
      })
      
    }
    // When #cardImage inside of #card-container is clicked
    $("#card-container").on("click", "#cardImage", function () {
      // empty #hereNow 
      $("#hereNow").empty();
      // create a variable that grabs the data attribute of #cardImage
      let venueID = $(this).attr("data");
      // create blank name and address variables
      let name, address;
      // look through the current place on firebase
      database.ref(`places/${venueID}`).once("value", function (snapShot) {
        // give the address variable the value of the current address
        address = snapShot.val().address;
        // Update the address text into the html #placeAddress
        $("#placeAddress").text(address);
        // give the name variable the value of the current place name
        name = snapShot.val().name;
        // update the place name text in html #placeName
      $("#placeName").text(name);
      // look through the users object on firebase
      database.ref(`places/${venueID}/users`).once("value", function (childSnapshot) {
        // for each user from the snapshot
        childSnapshot.forEach(function (childSnap) {
          // create a newList variable to append an <li> to the html
          let newList = $("<li>");
          // fill the new <li> with the data from the snapshot
          newList.text(childSnap.val());
          // append the newList and text to #hereNow in html
          $("#hereNow").append(newList);
          
        })
      })
    })
  })
  // create a checkout function
  let checkout = function () {
    // look at the current user object in the database
    database.ref(`users/${currentUserO.uid}`).once("value", function (snap) {
      // if the user has a current location
      if (snap.val().currentLocation != null) {
        // remove the user from the database
        database.ref(`places/${snap.val().currentLocation}/users/${currentUserO.uid}`).remove()
        // show the check in button
        $(`#checkIn${snap.val().currentLocation}`).removeClass('hide');
        // hide the checkout button
        $(`#checkOut${snap.val().currentLocation}`).addClass('hide');
        console.log(`Delete Successful`);
        // look into the database at the current location
        database.ref(`places/${snap.val().currentLocation}`).on("value", function (childSnap) {
          // Update the html with the number of people at the place
          $(`#${snap.val().currentLocation}numCheckedIn`).text(`${childSnap.child('users').numChildren()} have checked in`)
        })
        // set the database object to no location 
        database.ref(`users/${currentUserO.uid}`).set({
          email: currentUserO.email,
          username: currentUserO.username,
          currentLocation: "none",
        });
      }
      
    });
    currentUserO.currentLocation = "none";
  }
  
  // when .checkOut is clicked inside of #card-container 
  $("#card-container").on("click", ".checkOut", function () {
    // run the checkout function
    checkout();
  });
});