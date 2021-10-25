//helper / flag variables
let flagOpen = false;
let animPrevTime = null;
let flagAnimate = true;
const imgFolder = 'images';
const imgFormat = 'svg';
const debug = false;
// initializing webgl-earth vars
let screenOffset, tilt;
screenOffset = 40;
const windowWidth = window.innerWidth;
if (debug) { console.log('window inner width ', windowWidth); }

switch (true) {
    case ( windowWidth > 1200 ):
        tilt = 22;
        amplitude = 45;
        screenOffset = 40;
        break;

    case ( windowWidth > 1100 ):
        tilt = 22;
        amplitude = 40;
        screenOffset = 30;
        break;

    case ( windowWidth > 1000 ):
        tilt = 25;
        amplitude = 35;
        screenOffset = 30;
        break;

    case ( windowWidth > 800 ):
        tilt = 30;
        amplitude = 35;
        screenOffset = 30;
        break;

    case ( windowWidth > 700 ):
        tilt = 40;
        amplitude = 38;
        screenOffset = 20;
        break;

    case ( windowWidth > 600 ):
        tilt = 40;
        amplitude = 28;
        screenOffset = 20;
        break;

    case ( windowWidth > 500 ):
        tilt = 45;
        amplitude = 38;
        screenOffset = 20;
        break;

    case ( windowWidth > 400 ):
        tilt = 55;
        amplitude = 28;
        screenOffset = 20;
        break;

    case ( windowWidth > 300 ):
        tilt = 65;
        amplitude = 18;
        screenOffset = 20;
        break;

    default:
        tilt = 22;
        amplitude = 45;
        screenOffset = 40;
        break;
}

// initial rovers weather
let perseveranceWeather =         {
    "terrestrial_date": "2021-04-01", 
    "sol": "41",
    "min_temp": -83.8, 
    "max_temp": -21.6,  
    "sunrise": "06:09:02", 
    "sunset": "18:37:53"
};

let curiosityWeather = {
    "terrestrial_date": "2021-03-29",
    "sol": "3073",
    "min_temp": "-73",
    "max_temp": "-20",
    "atmo_opacity": "Sunny",
    "sunrise": "06:27",
    "sunset": "18:21",
};

let insightWeather = {
    "terrestrial_date": "2020-10-25",
    "sol": "681",
    "min_temp": "-95",
    "max_temp": "-4",
    "sunrise": "06:08",
    "sunset": "18:36",
};

// pop-up rover data
const roversPopUps = [
    {
        'rover_name' : 'Sojourner',
        'popup_content' : '',
        'landing_date' : 'July 4, 1997',
        'end_mission_date' : 'Sep. 27, 1997',
        'weight' : '10.6 kg / 23.3 lb',
        'rovered' : '0.1 km / 0.06 mi',
        'mission_link' : 'https://mars.nasa.gov/mars-exploration/missions/pathfinder/'
    },
    {
        'rover_name' : 'Spirit',
        'popup_content' : '',
        'landing_date' : 'January 4, 2004',
        'end_mission_date' : 'March 22, 2010',
        'weight' : '185 kg / 407.8 lb',
        'rovered' : '7.7 km / 4.78 mi',
        'mission_link' : 'https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/'
    },
    {
        'rover_name' : 'Opportunity',
        'popup_content' : '',
        'landing_date' : 'January 25, 2004',
        'end_mission_date' : 'February 13, 2019',
        'weight' : '185 kg / 407.8 lb',
        'rovered' : '45.16 km / 28.06 mi',
        'mission_link' : 'https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/'
    },
    {
        'rover_name' : 'Insight',
        'popup_content' : '',
        'landing_date' : 'November 26, 2018',
        'end_mission_date' : 'Still Operating',
        'weight' : '358 kg / 789.2 lb',
        'rovered' : 'Hey, I am a lander',
        'mission_link' : 'https://mars.nasa.gov/mars-exploration/missions/insight/'
    },
    {
        'rover_name' : 'Curiosity',
        'popup_content' : '',
        'landing_date' : 'August 6, 2012',
        'end_mission_date' : 'Still Operating',
        'weight' : '899 kg / 1,982 lb',
        'rovered' : '25.2 km / 15.55 mi (April 10, 2021)',
        'mission_link' : 'https://mars.nasa.gov/mars-exploration/missions/mars-science-laboratory/'
    },
    {
        'rover_name' : 'Perseverance',
        'popup_content' : '',
        'landing_date' : 'February 18, 2021',
        'end_mission_date' : 'Still Operating',
        'weight' : '1,025 kg / 2,260 lb',
        'rovered' : '0.25 km / 0.16 mi (April 10, 2021)',
        'mission_link' : 'https://mars.nasa.gov/mars-exploration/missions/mars2020/'
    },
    {
        'rover_name' : 'Ingenuity',
        'popup_content' : '',
        'landing_date' : 'February 18, 2021',
        'end_mission_date' : 'Still Operating',
        'weight' : '1.8 kg / 4 lb',
        'rovered' : '2.83 km / 24 min 29 sec',
        'mission_link' : 'https://mars.nasa.gov/technology/helicopter/'
    },
];
//DOM Elements
const marsDOM = document.getElementById('mars');
const marsContainerDOM = document.querySelector('.icon-dashboard');
const weatherDOM = document.querySelector('.weather');
const insightWDOM = document.getElementById('insight-wd');
const curiosityWDOM = document.getElementById('curiosity-wd');
const perseveranceWDOM = document.getElementById('perseverance-wd');
const configBTNDOM = document.querySelector('.btn-config');
const configHudDOM = document.querySelector('.config-hud-container');
const switchUnitsDOM = document.querySelector('.switch input');
const btnMainDOM = document.getElementById('main-button');
const rover1DOM = document.getElementById('rover1');
const rover2DOM = document.getElementById('rover2');
const rover3DOM = document.getElementById('rover3');
const rover4DOM = document.getElementById('rover4');
const rover5DOM = document.getElementById('rover5');
const rover6DOM = document.getElementById('rover6');
const rover7DOM = document.getElementById('rover7');
const locationDOM = document.querySelector('.text-location');
const locationTypeDOM = document.querySelector('.location-type');
const seasonDOM = document.querySelector('.text-season');
const solDOM = document.querySelector('.text-sol');
const roverNameDOM = document.querySelector('.text-rover');
const timeDOM = document.getElementById('time');
const timeSpanDoM = document.createElement("SPAN");
 // main navigation UX button
const navigationDOMS = [
    document.getElementById('main-button'),
    document.getElementById('rover1'),
    document.getElementById('rover2'),
    document.getElementById('rover3'),
    document.getElementById('rover4'),
    document.getElementById('rover5'),
    document.getElementById('rover6'),
    document.getElementById('rover7')
];
const navigationBTNS = ['mars','sojourner','spirit','opportunity','insight','curiosity','perseverance','ingenuity'];
let youAreHere = navigationBTNS[0];
// position of each rover on Mars
const latLng = [
    [0,0], //planet centered
    [19.33, 326.47], //sojourner
    [-14.5692, 175.4729], //spirit 
    [-2.9462, 354.4734], //opportunity +1
    [4.502, 135.623], //insight
    [-4.5895, 137.4417], //curiosity
    [18.4386, 77.5031], ///perseverance
    [23.4386, 75.5031] //ingenuity +2
];
// Mars map
const mars = new WE.map('mars', { 
    sky: false,
    width: 50,
    zoom:1,
    unconstrainedRotation: false
});
mars.setView([12,33],1);

// initializing navigation UI
initNavigationBTNS();
drawNavigationBTNS(null);

/*
* @description controls main navigation
* @param {number} btn index of navigation buttons array (button clicked)
*/
function handleNavigationClick(btn) {
    flagOpen =! flagOpen;
    for (i=1; i<navigationDOMS.length;i++){
        navigationDOMS[i].classList.toggle('open');
    }

    if(!btn) return; //clicked main button

    //search for where mars' icon is
    idxMars = navigationBTNS.indexOf('mars');
    //replace it with main button's icon
    navigationBTNS[idxMars] = navigationBTNS[0];
    //switch main button's icon to new clicked button if not mars
    if(idxMars !== btn ){
        navigationBTNS[0] = navigationBTNS[btn];
        //put mars on clicked button
        navigationBTNS[btn] = 'mars';
        flyTo(btn, tilt, screenOffset);
    } else {
        navigationBTNS[0] = 'mars';
        flyToHome();
    }
    
    youAreHere = navigationBTNS[0];
    updateWeatherDisplay(youAreHere);
    drawNavigationBTNS();
}


/////////////////////////////////////
// utilities
/*
* @description creates UI for navigation buttons and events
*/
function initNavigationBTNS() {
    // main buttons
    navigationDOMS.forEach((btn, idx) => {
        btn.querySelector('img').src = `${imgFolder}/icon_${navigationBTNS[idx]}.${imgFormat}`;
        btn.addEventListener('click', ()=>handleNavigationClick(idx));
    });
    // secondary buttons
    configBTNDOM.addEventListener('click', handleConfig);
    switchUnitsDOM.addEventListener('click', handleUnitChange);
}

/*
* @description controls main navigation
* @param {number} btn index of navigation buttons array (button clicked)
*/
function drawNavigationBTNS(btn) {
        navigationDOMS.forEach((btn, idx) => {
        btn.querySelector('img').src = `${imgFolder}/icon_${navigationBTNS[idx]}.${imgFormat}`;
    });
}

/*
* @description switches between Fahrenheit and Celsius
*/
function handleUnitChange() {
    if (debug) { console.log(switchUnitsDOM.checked);}
    localStorage.units = (switchUnitsDOM.checked) ? 'F' : 'C';
    updateWeatherData();
}

/*
* @description adds Mars texture to the planet
*/
function initMars() {
    WE.tileLayer('images/mars_1k.jpg',
    {
        tileSize: 8192,
        zoom:10,
        tms:true
    }
    ).addTo(mars);
}

/*
* @description saves default data to local storage if nothing there yet
*/
function initLocalStorage() {
    if(!localStorage.lastupdate) { localStorage.lastupdate = new Date('Sun Apr 10 2021 20:34:23 GMT-0300') };
    if(!localStorage.units) {
        localStorage.units = 'C'
    } else {
        if (localStorage.units === 'F') { switchUnitsDOM.checked = true }
    }
    if (!localStorage.perseveranceweather) {
        localStorage.perseveranceweather = JSON.stringify(perseveranceWeather);  
    } else {
        perseveranceWeather = localStorage.perseveranceweather;
    }
    if (!localStorage.curiosityweather) {
        localStorage.curiosityweather = JSON.stringify(curiosityWeather);  
    } else {
        curiosityWeather = localStorage.curiosityweather;
    }
    if (!localStorage.insightweather) {
        localStorage.insightweather = JSON.stringify(insightWeather);  
    } else {
        insightWeather = localStorage.insightweather;
    }
}

/*
* @description creates the Rovers markers with its popups
*/
function initMarkers(){
    const popupWidth = 220;
    const sojourner = WE.marker(latLng[1], "images/marker_sojourner.svg", 48, 48).addTo(mars);
    sojourner.bindPopup(`
    <div class="popup-title">${roversPopUps[0].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[0].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[0].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[0].weight}</div>
    <div class="popup-bold">Distance rovered:<BR><span class='popup-text'>${roversPopUps[0].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[0].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);

    const spirit = WE.marker(latLng[2], "images/marker_spirit.svg", 48, 48).addTo(mars);
    spirit.bindPopup(`
    <div class="popup-title">${roversPopUps[1].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[1].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[1].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[1].weight}</div>
    <div class="popup-bold">Distance rovered:<BR><span class='popup-text'>${roversPopUps[1].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[1].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);

    const opportunity = WE.marker(latLng[3], "images/marker_opportunity.svg", 48, 48).addTo(mars);
    opportunity.bindPopup(`
    <div class="popup-title">${roversPopUps[2].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[2].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[2].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[2].weight}</div>
    <div class="popup-bold">Distance rovered:<BR><span class='popup-text'>${roversPopUps[2].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[2].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);

    const insight = WE.marker(latLng[4], "images/marker_insight.svg", 48, 48).addTo(mars);
    insight.bindPopup(`
    <div class="popup-title">${roversPopUps[3].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[3].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[3].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[3].weight}</div>
    <div class="popup-bold">Distance rovered:<BR><span class='popup-text'>${roversPopUps[3].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[3].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);
    
    const curiosity = WE.marker(latLng[5], "images/marker_curiosity.svg", 48, 48).addTo(mars);
    curiosity.bindPopup(`
    <div class="popup-title">${roversPopUps[4].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[4].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[4].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[4].weight}</div>
    <div class="popup-bold">Distance rovered:<BR><span class='popup-text'>${roversPopUps[4].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[4].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);

    const perseverance = WE.marker(latLng[6], "images/marker_perseverance.svg", 48, 48).addTo(mars);
    perseverance.bindPopup(`
    <div class="popup-title">${roversPopUps[5].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[5].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[5].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[5].weight}</div>
    <div class="popup-bold">Distance rovered:<BR><span class='popup-text'>${roversPopUps[5].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[5].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);

    const ingenuity = WE.marker(latLng[7], "images/marker_ingenuity.svg", 48, 48).addTo(mars);
    ingenuity.bindPopup(`
    <div class="popup-title">${roversPopUps[6].rover_name}</div>
    <div class="popup-bold">Landed: <span class='popup-text'>${roversPopUps[6].landing_date}</div>
    <div class="popup-bold">End of mission: <span class='popup-text'>${roversPopUps[6].end_mission_date}</div>
    <div class="popup-bold">Weight: <span class='popup-text'>${roversPopUps[6].weight}</div>
    <div class="popup-bold">Flown:<BR><span class='popup-text'>${roversPopUps[6].rovered}</div>
    <div class="popup-link"><a href = "${roversPopUps[6].mission_link}" target="_blank">Follow this link<BR>to learn more about this mission</a></div>
    `, popupWidth);
}

/*
* @description animates to Rover position
* @param {number} btn index of navigation buttons array (button clicked)
* @param {number} tilt camera inclination
* @param {number} screenOffset from center of target
* @param {number} heading
* @param {number} duration of animation in seconds
*/
function flyTo(btn, tilt, screenOffset, heading=0, duration=2) {
    flagAnimate = false;
    const latlngCenter = latLng[btn];
    const bound1 = [latlngCenter[0] + amplitude , latlngCenter[1] + amplitude];
    const bound2 = [latlngCenter[0] - (amplitude + parseInt(screenOffset)) , latlngCenter[1] - amplitude];
    mars.panInsideBounds(
        [bound1, bound2],
        {heading: heading, tilt:tilt, duration: duration}
    );
}

/*
* @description animates to whole planet view
*/
function flyToHome() {
    mars.setView([12,33],1);
    flagAnimate = true;
};

/*
* @description keeps the planet rotating
*/
requestAnimationFrame(function animate(now) {
    if (flagAnimate) {
        let actualPos = mars.getPosition();
        let elapsedTime = animPrevTime? now - animPrevTime: 0;
        animPrevTime = now;
        mars.setCenter([actualPos[0], actualPos[1] + 0.4*(elapsedTime/30)]);
    }
    requestAnimationFrame(animate); 
});

/*
* @description toggles configuration HUD (gear button)
*/
function handleConfig() {
    configHudDOM.classList.toggle('open');
    configBTNDOM.classList.toggle('open');
}

/*
* @description controls sequence of app initialization
*/
function initApp() {
    initMars();
    initMarkers();
    initLocalStorage();
    updateWeatherData()
}

/*
* @description fetchs weather data from NASA's API
*/
function updateWeatherData() {
    //fetching data
    const url_curiosity = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';
    const url_perseverance = 'https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json';

    const today = new Date();
    const latestCheck = new Date(localStorage.lastupdate);
    const updateInterval = (today.getTime() - latestCheck.getTime()) / (1000 * 3600 * 24);
    // const updateInterval = 1.5; // force interval for debugging
    if (debug) {
        console.log('interval', updateInterval);
        console.log('last check',latestCheck.getTime());
        console.log('today check',today.getTime());
    }

    if ( updateInterval ) { //> 1 if request limits apply
      //time to check for new InSight mission weather data
      localStorage.lastupdate = today;
      //Curiosity
      if (debug) { console.log('going online for weather'); }
      fetch(url_curiosity)
      .then( response => {
          if (!response.ok) {
            //TODO display message card
            console.log('some error fetching curiosity weather data');
          }
          return response.json();
      })
      .then (data => {
          if (debug) { console.log("SOLES", data) ; }
          curiosityWeather = data.soles[0];
          if (debug) { console.log("CURIO", curiosityWeather); }
          localStorage.curiosityweather = JSON.stringify(curiosityWeather)
          if (debug) {console.log('weather curiosity', curiosityWeather);}
          renderWeatherData('curiosity');
        })
        .catch(error => {
            console.log('error when fetching curiosity weather data', error);
            renderWeatherData('curiosity');
      })
      //Perseverance
      fetch(url_perseverance)
      .then( response => {
          if(!response.ok) {
              //TODO display message card
              console.log('some error fetching perseverance weather data');
          }
          return response.json();
      })
      .then ( data => {
          if (debug) { console.log("last", data.sols[data.sols.length-1]); }
          perseveranceWeather = data.sols[data.sols.length-1];
          localStorage.perseveranceweather = JSON.stringify(perseveranceWeather)
          if (debug) { console.log('weather perseverance', perseveranceWeather);}
          renderWeatherData('perseverance');
      })
      .catch( error => {
        if (debug) { alert('error when fetching perseverance weather data'); }
        renderWeatherData('perseverance');
      })
    }else{
      //no need to go online, use local data instead
      if (debug) {console.log('using local weather data');}
      //updating weather data
      let localData = JSON.parse(localStorage.getItem('insightweather'));
      insightWeather = {...localData};
      localData = JSON.parse(localStorage.getItem('curiosityweather'));
      curiosityWeather = {...localData};
      localData = JSON.parse(localStorage.getItem('perseveranceweather'));
      perseveranceWeather = {...localData};
      renderWeatherData('all');
    }
    
}

/*
* @description displays weather data available to specigfic Rovers
*/
function renderWeatherData(rover) {
    if (debug) { console.log(rover); }
//updating UI data
const tempUnit = localStorage.units;
if (rover === 'insight' || rover === 'all') {
    //insight
    const insightsolDOM = insightWDOM.querySelector('.date');
    let date = new Date(insightWeather.terrestrial_date);
    insightsolDOM.textContent = `Sol ${insightWeather.sol} / ${date.toDateString('en-US')}`;
    const insightMaxDOM = insightWDOM.querySelector('.high-temp');
    const insightMinDOM = insightWDOM.querySelector('.low-temp');
    insightMaxDOM.innerHTML = `${calcTemp(insightWeather.max_temp, tempUnit)}<span>${tempUnit}</span>`;
    insightMinDOM.innerHTML = `${calcTemp(insightWeather.min_temp, tempUnit)}<span>${tempUnit}</span>`;
    const insightSunrise = insightWDOM.querySelector('.sunrise span');
    const insightSunset = insightWDOM.querySelector('.sunset span');
    insightSunrise.textContent = noSeconds(insightWeather.sunrise);
    insightSunset.textContent = noSeconds(insightWeather.sunset);
}
if (rover === 'curiosity' || rover === 'all') {
    //curiosity
    const curiositysolDOM = curiosityWDOM.querySelector('.date');
    date = new Date(curiosityWeather.terrestrial_date);
    curiositysolDOM.textContent = `Sol ${curiosityWeather.sol} / ${date.toDateString('en-US')}`;
    const curiosityMaxDOM = curiosityWDOM.querySelector('.high-temp');
    const curiosityMinDOM = curiosityWDOM.querySelector('.low-temp');
    curiosityMaxDOM.innerHTML = `${calcTemp(curiosityWeather.max_temp, tempUnit)}<span>${tempUnit}</span>`;
    curiosityMinDOM.innerHTML = `${calcTemp(curiosityWeather.min_temp, tempUnit)}<span>${tempUnit}</span>`;
    const curiositySunrise = curiosityWDOM.querySelector('.sunrise span');
    const curiositySunset = curiosityWDOM.querySelector('.sunset span');
    curiositySunrise.textContent = noSeconds(curiosityWeather.sunrise);
    curiositySunset.textContent = noSeconds(curiosityWeather.sunset);
    const curiosityOpacity = curiosityWDOM.querySelector('.opacity');
    curiosityOpacity.textContent = curiosityWeather.atmo_opacity;
    const curiosityIconWeather = curiosityWDOM.querySelector('.temperature img');
    curiosityIconWeather.src = `${imgFolder}/${getWeatherIcon(curiosityWeather.atmo_opacity)}.${imgFormat}`;
}
if (rover === 'perseverance' || rover === 'all') {
    //perseverance
    const perseverancesolDOM = perseveranceWDOM.querySelector('.date');
    date = new Date(perseveranceWeather.terrestrial_date);
    perseverancesolDOM.textContent = `Sol ${perseveranceWeather.sol} / ${date.toDateString('en-US')}`;
    const perseveranceMaxDOM = perseveranceWDOM.querySelector('.high-temp');
    const perseveranceMinDOM = perseveranceWDOM.querySelector('.low-temp');
    perseveranceMaxDOM.innerHTML = `${calcTemp(perseveranceWeather.max_temp, tempUnit)}<span>${tempUnit}</span>`;
    perseveranceMinDOM.innerHTML = `${calcTemp(perseveranceWeather.min_temp, tempUnit)}<span>${tempUnit}</span>`;
    const perseveranceSunrise = perseveranceWDOM.querySelector('.sunrise span');
    const perseveranceSunset = perseveranceWDOM.querySelector('.sunset span');
    perseveranceSunrise.textContent = noSeconds(perseveranceWeather.sunrise);
    perseveranceSunset.textContent = noSeconds(perseveranceWeather.sunset);
}
}


/*
* @description translate between temperature systems
* @param {number} temperature to translate
* @param {string} system in wich the temperature is passed to the function (F)ahrenheit || (C)elsius
* @return {number} translated temperature
*/
function calcTemp(temp, system) {
    if (system === 'F') {
        return Math.round((temp * 1.8) + 32);
    } else {
        return Math.round(temp);
    }
}

/*
* @description cuts away the seconds in a given time
* @param {string} time (HH:MM:SS)
*/
function noSeconds(time) {
    console.log('TIME ', typeof(time), time)
    return time.slice(0,5);
}

/*
* @description gets the corresponding icon to a weather condition
* @param {string} atmo atmospheric condition (cloudy || windy || sunny default)
* @return {number} translated temperature
*/
function getWeatherIcon(atmo) {
    switch(atmo) {
        case 'cloudy':
            return 'icon_weather_cloudy';
        
        case 'windy':
            return 'icon_weather_windy';

        default:
            return 'icon_weather_sunny';
    }
}


window.addEventListener('load', initApp);