# Earthquake Visualization
![Earthquake Visualizations](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/earthquakes_overview.png)

-----

## Project Description

The goal of this project was to visualize recent earthquakes on a Leaflet map, and represent key information about them. A user should be able to open the map and see where recent Earthquakes have been, get a sense of their magnitude and depth, and click for more information. An additional layer was added to show the locations of fault lines. To achieve this, a JavaScript file was written that pulled data of the previous week of earthquakes from the [United States Geological Survey](https://www.usgs.gov/) API. The data was then parsed to show the location, magnitude and other relevant information and Leaflet was used to plot this on a map.

-----

## Table of Contents

1. [What the Visualization Shows](https://github.com/jonnybrammah/earthquake-visualization/blob/main/README.md#what-the-visualization-shows)
2. [How the Map was Created](https://github.com/jonnybrammah/earthquake-visualization/blob/main/README.md#setting-up-the-map)
3. [Possible Next Steps](https://github.com/jonnybrammah/earthquake-visualization/blob/main/README.md#possible-next-steps)

-----
### What the Visualization Shows

The final product of the Earthquake Visualization Project is shown below:

![Overall Map](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/overall_map.png)

Each earthquake over the previous week is shown by a circle. The size of the circle represents the magnitude of the earthquake, and the color represents it's depth below the surface in miles, with a legend in the corner. Fault lines have been added as orange lines.

It's clear from this map that the earthquakes broadly follow the position of the fault lines, as expected, with many in California and up the West Coast and a large number following the southern coast of Alaska. You can also see that broadly these earthquakes are relatively low magnitude, with even the larger circles on this current map less than Magnitude 4.

Similarly, you can see that most of these earthquakes are colored green or yellow, indicating they are relatively shallow.

One interesting point to note though is you can see a fairly sizable number of earthquakes in Oklahoma, Idaho and Texas (and surrounding areas of these states), despite them being relatively distant from any fault lines. The USGS actually has [a webpage relating to this phenomenon in Oklahoma](https://www.usgs.gov/faqs/oklahoma-has-had-surge-earthquakes-2009-are-they-due-fracking) which explains that "majority of earthquakes in Oklahoma are caused by the industrial practice​ known as 'wastewater disposal'".

![Oklahoma and Texas](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/Oklahoma_Texas.png)

-----

### Setting up the Map

#### Base Maps

Two standard Leaflet tile layers were used as background maps for this project:

1. Street Map
![Street Map](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/earthquakes_overview.png)

2. Topographic Map
![Topo Map](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/base_layer_topo.png)

These were stored as the variable baseMaps and a control was added to be able to switch between these.

#### Overlay Maps

##### Earthquake Markers

Data from the USGS was extracted and stored as a series of circles, where the size of the circle represented the magnitude of the earthquake, and its color represented the depth of the quake. Latitude and Longitude data was then used to add this as an overlay map to the Leaflet map:

![Earthquake Overlay](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/overlays_earthquakes.png)

Additional information was added so that when a user clicked on a specific earthquake, this information would appear. The information selected to be shown was:
- The "Place" of the Earthquake
- Its magnitude
- The date and time that the Earthquake was recorded (This had to be converted from a UNIX datetime stamp first)
- Its depth.

This can all be seen below:

![click_info](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/click_info.png)

##### Fault Lines

Data from a [GeoJson file](https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json) was then added as another overlay map to show the locations of fault lines. This was a relatively simple addition due to the ease of adding geoJson layers.

![Fault Lines](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/overlays_faultlines.png) 

#### Finishing Touches

The last thing to be added to the map was a legend so that users could be aware of what each color meant. Including this meant altering the html text inside the javascript file to add the legend, with a square next to each depth range, colored accordingly:

![Legend](https://raw.githubusercontent.com/jonnybrammah/earthquake-visualization/main/Images/legend.png)

Since this code went beyond the scope of our learning in class, it involved some additional research and working with TAs.

-----

### Possible Next Steps

If this project were to be extended, another feature that would be useful might be to have the opacity of an earthquake change so that it becomes more transparent the less recently it was recorded. 

-----

### Acknowledgements 

The starting point for the code to add the legend can be found here: https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
