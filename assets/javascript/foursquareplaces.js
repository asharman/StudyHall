let locationName;

let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&near=Orlando, FL&query=coffee`;

console.log(`Working`);

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
            <div class="card-image">
                <img src="http://wptest.io/demo/wp-content/uploads/sites/2/2012/12/unicorn-wallpaper.jpg">
                <span id="place" class="card-title">${name}</span>
            </div>
            <div class="card-content paragraph">
                <div class="row">
                    <div class="col s9">
                        <p id="address" class="col s9">${address[0]}</p>
                    </div>
                    <div class="col s3">
                        <a class="btn-small waves-effect waves-light red right bottom hoverable"><i class="material-icons">&#10003</i></a>
                    </div>
                </div>
            </div>
        </div>`)
        }
    }
});