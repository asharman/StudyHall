let locationName;

let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&near=Orlando, FL&query=coffee`;

console.log(`Working`);

$.ajax({
    url: queryURL,
    datatype: "json",
    method: "GET",
}).then(function(response){
    console.log(response);
    let venueID = response.response.venues[1].id;
    $.ajax({
        url: `https://api.foursquare.com/v2/venues/${venueID}/photos?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323`
    }).then(function(photo){
        console.log(photo);
        let newImg = $("<img>");
        let imgRef = photo.response.photos.items[0];
        newImg.attr("src", imgRef.prefix + "original" + imgRef.suffix);
        $("#test").append(newImg);
    })
    $.ajax({
        url: `https://api.foursquare.com/v2/venues/${venueID}?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323`,
        method: "GET"
    }).then(function(details){
        console.log(details);
        let name = details.response.venue.name;
        let address = details.response.venue.location.formattedAddress;

        
    })
});