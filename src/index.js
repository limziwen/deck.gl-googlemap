

import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import mapStyles from './map-styles';


const sourceData = './vancouvercrime.json';
//Types
// Other Theft (2)
// Break and Enter Residential/Other (2)
// Mischief (3)
// Break and Enter Commercial (2)
// Offence Against a Person (2)
// Theft from Vehicle (3)
// Vehicle Collision or Pedestrian Struck (with Injury) (3)
// Vehicle Collision or Pedestrian Struck (with Fatality) (1)
// Theft of Vehicle (3)
// Homicide (1)
// Theft of Bicycle (3)

function getWeight(d){
  const yearoffset = d.YEAR - 2003; //data goes from 2003 to 2017
  const {type} = d;
  if(type == "Homicide" || "Vehicle Collision or Pedestrian Struck (with Fatality)"){
    return 60 + yearoffset;
  }else if(type == "Break and Enter Commercial" || "Offence Against a Person" || "Break and Enter Residential/Other"){
    return 40 + yearoffset;
  }else{
    return 20 + yearoffset;
  }
}

function returnFillColor (type) {
  // console.log("called filled colour")
  // console.log("recieved", type)
  if(type == "Homicide" || "Vehicle Collision or Pedestrian Struck (with Fatality)"){
    return [200, 0, 40, 100] //red
  }else if(type == "Break and Enter Commercial" || "Offence Against a Person" || "Break and Enter Residential/Other"){
    return [255, 140, 0, 100] //orange
  }else{
    return [100, 215, 255, 100] //blue
  }
};


const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: sourceData,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 5,
    getPosition: d => [d.Longitude, d.Latitude],
    //getFillColor:  [255, 255, 255, 150],
    //getFillColor: d => d.TYPE == "Offence Against a Person" ? [200, 0, 40, 0] : [255, 140, 0, 255],
    getFillColor: d => returnFillColor(d.TYPE),

    // pickable: true,
    // onHover: ({object, x, y}) => {
    //     const el = document.getElementById('tooltip');
    //     if (object) {
    //       const { n_killed, incident_id } = object;
    //       el.innerHTML = `<h1>ID ${incident_id}</h1>`
    //       el.style.display = 'block';
    //       el.style.opacity = 0.9;
    //       el.style.left = x + 'px';
    //       el.style.top = y + 'px';
    //     } else {
    //       el.style.opacity = 0.0;
    //     }
    // },
    // onClick: ({object, x, y}) => {
    //   window.open(`https://www.gunviolencearchive.org/incident/${object.incident_id}`)
    // },
     
  });


const heatmap = () => new HeatmapLayer({
      id: 'heat',
      data: sourceData,
      getPosition: d => [d.Longitude, d.Latitude],
      // getWeight: d => d.n_killed + (d.n_injured * 0.5),
      getWeight: d => getWeight(d),
      radiusPixels: 25,
});


const hexagon = () => new HexagonLayer({
        id: 'hex',
        data: sourceData,
        getPosition: d => [d.Longitude, d.Latitude],
        // getElevationWeight: d => (d.n_killed * 2) + d.n_injured,
        getElevationWeight: d => getWeight(d),
        elevationScale: 80,
        extruded: true,
        radius: 400,         
        opacity: 0.6,        
        coverage: 0.88,
        lowerPercentile: 50,
        getFillColor: d=> returnFillColor(d.TYPE),
    });


window.initMap = () => {

    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.0, lng: -100.0},
        zoom: 5,
        styles: mapStyles
    });

    const overlay = new GoogleMapsOverlay({
        layers: [
            // scatterplot(),
            heatmap(),
            hexagon()
        ],
    });

    
    overlay.setMap(map);
    
}


