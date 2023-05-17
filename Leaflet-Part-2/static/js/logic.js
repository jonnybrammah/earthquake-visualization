let centerCoords = [37.0902, -95.7129];
let mapZoomLevel = 4;

// Create a function that will create the map and will add earthquake locations to it

///// ATTEMPTING TO INCLUDE PLATELOCATIONS AS AN OVERLAY MAP /////
function createMap(earthquakeLocations, plateLocations) {

    // Create tile layers that will be the initial background of our map:
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Street": streetMap,
        "Topography": topo
      };

    // Create an overlapMaps object that will hold the earthquake data from the geoJson
    let overlayMaps = {
        "Earthquakes": earthquakeLocations,
        //////Wondering if this is how to overlay the plate info:
        "Plate Boundaries": plateLocations
    };

    //Put toegther the whole map
    let myMap = L.map("map", {
        center: centerCoords,
        zoom: mapZoomLevel,
        layers: [streetMap, earthquakeLocations]
      });

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

}

// Create a function to create the circles on the map
function createCircles(response) {

    // Initialize an array to hold the earthquake markers
    earthquakeMarkers = [];

    //Loop through the response data (which is a list of dictionaries)
    for(let i = 0; i < response.features.length; i++) {
        
        // Loop through each dictionary
        let earthquake = response.features[i];

        // Extract key information from the response and save as variables

        //Coordinates
        let longitude = earthquake.geometry.coordinates[0];
        let latitude = earthquake.geometry.coordinates[1];
        let depth = earthquake.geometry.coordinates[2];
        //Magnitude
        let magnitude = earthquake.properties.mag;

        //Extract the date and store as a string (I got help from Stack Overflow here!)
        let date = new Date(earthquake.properties.time);
        let formattedDate = date.toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

        //Extact the "Place" of the earthquake
        let location = earthquake.properties.place;


        //Set the color based on the depth of the earthquake:
        
        let color = "";

        if(depth > 40) {
            color = "darkred";
        }
        else if(depth > 30) {
            color = "red";
        }
        else if(depth > 20) {
            color = "deeppink";
        }
        else if(depth > 15) {
            color = "orange";
        }
        else if(depth > 10) {
            color = "yellow";
        }
        else if(depth > 5) {
            color = "darkgreen";
        }
        else if(depth > 0) {
            color = "green";
        }
        else if(depth > -10) {
            color = "lightgreen";
        }

        //Create the circle markers with increasing radius based on magnitude and color set based on depth
        let circle = L.circle([latitude, longitude], {
            color: color,
            weight: 0.1,
            fillColor: color,
            fillOpacity: 0.5,
            radius: magnitude * 10000
        })//Add a pop-up for when clicked that will show the location as the header, the magnitude, date, and depth
        .bindPopup(`<h3> Earthquake at ${location}</h3> <hr> <h4>Magnitude: ${magnitude}</h4> <hr> <h5>Date: ${formattedDate}</h5> <hr> <h5>Depth: ${depth}</h5>`);

        // Add the circle marker information to the earthquakeMarkers array
        earthquakeMarkers.push(circle);
        
    }
   
    //create the layer group for the earthquake markers
    createMap(L.layerGroup(earthquakeMarkers));

}


//// Attempting a function to add GEOJson data for plates. /////
function PlateBoundaries(response) {

    let boundaryInfo = L.geoJson(response);

    console.log(boundaryInfo)

    createMap(L.layerGroup(boundaryInfo));

}



// Define the URL to get all Earthquakes from the previous week
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Perform the API call to the usgs website and then do the createCircles function on the response
d3.json(url).then(createCircles);

// Define the URL to get all Plate Boundary information
platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//Perform the API call to get the plate boundary geojson
d3.json(platesUrl).then(PlateBoundaries);