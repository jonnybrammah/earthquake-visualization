let centerCoords = [37.0902, -95.7129];
let mapZoomLevel = 4;


// Define the URL to get all Earthquakes from the previous week
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define the URL to get all Plate Boundary information
platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//Perform the API call to the usgs website and then start creating the map
d3.json(url).then(function(response) {

//Perform the API call the plate boundaries info 
    d3.json(platesUrl).then(function(plates_response) {

        // Create tile layers that will be the initial background of our map:
        let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });

        // Store these two tile maps in the baseMaps dictionary
        let baseMaps = {
            "Street": streetMap,
            "Topography": topo
        };


        // Initialize an array to hold the earthquake markers
        earthquakeMarkers = [];

        //Loop through the response data from the usgs (which is a list of dictionaries)
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

            //Extract the "Place" of the earthquake
            let location = earthquake.properties.place;


            //Set the color based on the depth of the earthquake:
            let color = "";

            if(depth > 90) {
                color = "#98ee00";
            }
            else if(depth > 70) {
                color = "#d4ee00";
            }
            else if(depth > 50) {
                color = "#ee9c00";
            }
            else if(depth > 30) {
                color = "#eecc00";
            }
            else if(depth > 10) {
                color = "#d4ee00";
            }
            else if(depth > -10) {
                color = "#98ee00";
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
        
        // Turn the earthquake markers into a layergroup called earthquakeCircles
        earthquakeCircles = L.layerGroup(earthquakeMarkers)

        // Store the geoJson data for the fault lines
        let faultLines = L.geoJson(plates_response, {
            // Styling each feature (in this case, a neighborhood)
            style: function(feature) {
              return {
                color: "orange",
                weight: 3
              };
            },
        });

        // Store the earthquakeCircles and the fault lines data in a dictionary called "overlayMaps"
        let overlayMaps = {
            "Earthquakes": earthquakeCircles,
            "Fault Lines": faultLines
        };

        //Put together the whole map
        let myMap = L.map("map", {
            center: centerCoords,
            zoom: mapZoomLevel,
            layers: [streetMap, earthquakeCircles]
        });


        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        // Add the legend (a TA helped me a lot with this)
        var legend = L.control({
            position: "bottomright"
        });

        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend");

            var grades = [-10, 10, 30, 50, 70, 90];
            var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"];

            // Loop through our intervals and generate a label with a colored square for each interval.
            for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: "
                + colors[i]
                + "'></i> "
                + grades[i]
                + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
            }
            return div;
        };

        legend.addTo(myMap);


    });

});







