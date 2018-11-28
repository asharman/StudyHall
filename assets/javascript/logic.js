$(document).ready(function () {
  $('.modal').modal();

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



  let database = firebase.database();

  const auth = firebase.auth();
  let currentUserO = {
    email: "",
    uid: "",
    username: "",
    currentLocation: "none"
  }

  $("#log-in").on("click", function () {
    auth.signInWithEmailAndPassword($("#email").val(), $("#password").val());

  })

  $("#sign-up").on("click", function () {

    const useremail = $("#email").val();
    const userpassword = $("#password").val();

    auth.createUserWithEmailAndPassword(useremail, userpassword)
  })

  $("#sign-out").on("click", function () {
    auth.signOut();
    $("#sign-out").addClass("hide");
    $("#log-in").removeClass("hide");
    $("#sign-up").removeClass("hide");

  })

  auth.onAuthStateChanged(function (firebaseUser) {
    let user = auth.currentUser;
    if (user != null) {

      currentUserO.email = user.email;
      currentUserO.uid = user.uid;
      let username = user.displayName;

      if (username == null) {

        username = $("#username").val();
        user.updateProfile({
          displayName: username
        }).then(function () {
          let userRef = database.ref(`users/` + currentUserO.uid);

          userRef.set({
            email: currentUserO.email,
            username: username,
            currentLocation: currentUserO.currentLocation,
          });
        });
      }

      currentUserO.username = username;
      currentUserO.email = user.email;
      currentUserO.uid = user.uid;

      let userRef = database.ref(`users/` + currentUserO.uid);
        userRef.once("value", function (snap) {

          if (snap.val().currentLocation != null) {
            currentUserO.currentLocation = snap.val().currentLocation;
            userRef.set({
              email: currentUserO.email,
              username: currentUserO.username,
              currentLocation: currentUserO.currentLocation,
            });
          }
        });
      $("#sign-out").removeClass("hide");
      $("#log-in").addClass("hide");
      $("#sign-up").addClass("hide");
    }
    else {
      console.log("not logged in");

    }
  })

  console.log(`Working`);

  $("#searchButton").on("click", function () {
    $("#card-container").empty();
    let latitude, longitude;
    navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&ll=${latitude},${longitude}&query=coffee&limit=15`;
      $.ajax({
        url: queryURL,
        datatype: "json",
        method: "GET",
      }).then(function (response) {
        object = response;
        for (i in response.response.venues) {
          let name = response.response.venues[i].name;
          let address = response.response.venues[i].location.formattedAddress;

          if (address.length === 3) {

            $("#card-container").append(`
          <div class="card card-limited hoverable">
          <div data="${i}" class="card-image" href="#modal">
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

  $("#card-container").on("click", "#addButton", function () {
    let venueIndex = $(this).attr("data");
    let venue = object.response.venues[venueIndex];

    database.ref('places/').push({
      name: venue.name,
      address: venue.location.formattedAddress[0],
    });
  });

  database.ref('places/').on("child_added", function (childSnap) {
    $("#card-container").append(`
    <div class="card card-limited hoverable">
    <div data="${childSnap.key}" id="cardImage" class="card-image modal-trigger" href="#modal">
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
    <a data="${childSnap.key}" id="checkIn" class="btn-small waves-effect waves-light red right bottom hoverable"><i class="material-icons">&#10003</i></a>
    </div>
    </div>
    </div>
    </div>`);
  });

  $("#card-container").on("click", "#checkIn", function () {
    let venueID = $(this).attr("data");
    currentUserO.currentLocation = venueID;

    checkIn(venueID);

    database.ref(`places/${venueID}`).on("value", function (childSnap) {
      $(`#${venueID}numCheckedIn`).text(`${childSnap.child('users').numChildren()} have checked in`)
    })
  });

  let checkIn = function (ID) {
    database.ref(`users/${currentUserO.uid}`).once("value", function (snap) {
      if (snap.val().currentLocation != null) {
        database.ref(`places/${snap.val().currentLocation}/users/${currentUserO.uid}`).remove()
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
      }

    })

  }

  $("#card-container").on("click", "#cardImage", function () {
    $("#hereNow").empty();
    let venueID = $(this).attr("data");
    let name, address;
    database.ref(`places/${venueID}`).once("value", function (snapShot) {
      address = snapShot.val().address;
      $("#placeAddress").text(address);

      name = snapShot.val().name;
      $("#placeName").text(name);

      database.ref(`places/${venueID}/users`).once("value", function (childSnapshot) {
        childSnapshot.forEach(function (childSnap) {
          let newList = $("<li>");
          newList.text(childSnap.val());
          $("#hereNow").append(newList);

        })
      })
    })
  })


});