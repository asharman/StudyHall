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

  let storage = firebase.storage();
  let storageRef = storage.ref();

  const auth = firebase.auth();
  // auth.signInWithEmailAndPassword(email, pass);
  // auth.createUserWithEmailAndPassword(email, pass);
  // auth.onAuthStateChanged(function() {});

  // $("#email").val()
  // $("#password").val()

  $("#log-in").on("click", function() {
    auth.signInWithEmailAndPassword($("#email").val(), $("#password").val());
    console.log("log-in success");
    
  })

  $("#sign-up").on("click", function() {
    auth.createUserWithEmailAndPassword($("#email").val(), $("#password").val());
    console.log("New user success");
    })

  $("#sign-out").on("click", function() {
    auth.signOut();
    $("#sign-out").addClass("hide");
    $("#log-in").removeClass("hide");
      $("#sign-up").removeClass("hide");

  })

  auth.onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      console.log(firebaseUser);
      $("#sign-out").removeClass("hide");
      $("#log-in").addClass("hide");
      $("#sign-up").addClass("hide");
    }
    else {
      console.log("not logged in");
      
    }
  })


  let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&near=Orlando, FL&query=coffee`;
  let object;

  console.log(`Working`);

  $("#searchButton").on("click", function () {
    $("#card-container").empty();
    $.ajax({
      url: queryURL,
      datatype: "json",
      method: "GET",
    }).then(function (response) {
      console.log(response);
      object = response;
      for (i in response.response.venues) {
        let name = response.response.venues[i].name;
        let address = response.response.venues[i].location.formattedAddress;
        console.log(name);
        console.log(address[0]);

        if (address.length === 3) {

          $("#card-container").append(`
          <div class="card card-limited hoverable">
          <div data="${i}" class="card-image modal-trigger" href="#modal">
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

  $("#card-container").on("click", "#addButton", function () {
    let venueIndex = $(this).attr("data");
    let venue = object.response.venues[venueIndex];
    console.log(venue);

    database.ref().push({
      name: venue.name,
      address: venue.location.formattedAddress[0],
    });
  });

  database.ref().on("child_added", function (childSnap) {
    console.log(childSnap);
    $("#card-container").append(`
    <div class="card card-limited hoverable">
    <div class="card-image modal-trigger" href="#modal">
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

  $("#card-container").on("click", "#checkIn", function(){
    let venueID = $(this).attr("data");
    database.ref(`/${venueID}/users`).push(true);
    database.ref(`/${venueID}`).on("value", function(childSnap){
      $(`#${venueID}numCheckedIn`).text(`${childSnap.child('users').numChildren()} have checked in`)
    })
  })
});