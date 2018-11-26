$(document).ready(function () {
  $('.sidenav').sidenav();


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD8NvLROiMcBmHGv5tVxKjOBCm3ISO40HU",
    authDomain: "studyhall-169e6.firebaseapp.com",
    databaseURL: "https://studyhall-169e6.firebaseio.com",
    projectId: "studyhall-169e6",
    storageBucket: "studyhall-169e6.appspot.com",
    messagingSenderId: "448862351238"
  };
  firebase.initializeApp(config);
  var uiConfig = {
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

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  var database = firebase.database();

  var storage = firebase.storage();
  var storageRef = storage.ref();

  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().getRedirectResult().then(function (result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  // $(".card").on("click", function() {

  // })

  document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
  // var collapsibleElem = document.querySelector('.collapsible');
  // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

  // Or with jQuery


});

let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&near=Orlando, FL&query=coffee`;

console.log(`Working`);

$("#searchButton").on("click", function () {
  $("#card-container").empty();
  $.ajax({
    url: queryURL,
    datatype: "json",
    method: "GET",
  }).then(function (response) {
    console.log(response);
    for (i in response.response.venues) {
      let venueID = response.response.venues[i].id;
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
