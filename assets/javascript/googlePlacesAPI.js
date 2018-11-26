let locationName;

let queryURL = `https://api.foursquare.com/v2/venues/search?client_id=MRGWSL0B0JOCS24FEY2DXNMTQSPVX32A2QQ2WGLGXKPJ4OBM&client_secret=A5TGKNJQUCFJFLVHRC1R1BXIHN35GZYKLFPZVV5W11PTHA5T&v=20180323&near&query=coffee`;

console.log(`Working`);

$.ajax({
    url: queryURL,
    datatype: "json",
    method: "GET",
}).then(function(response){
    console.log(response);
});