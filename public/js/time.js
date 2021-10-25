const leapIERS = 37;
let timeInterval = setInterval(updateTime, 1000) ;

function updateTime() {
    const utcTime = new Date();
    //calculations
    //earth
    const unixMillis = utcTime.getTime(); //unix epoch milliseconds
    const julianDateUT = 2440587.5 +  unixMillis / (8.64 * Math.pow(10, 7)); // unix epoch milliseconds but in julian
    const julianDateTT = (julianDateUT + (leapIERS + 32.184) / 86400); // terrestrial time in julian days (atomic leap)
    const julianDateSinceEpoch = (julianDateTT - 2451545.0); // days since epoch in julian days
    //mars
    const midNightMatch = 4.5;
    const midNightDiffCorrection = 0.00096;
    const diffEarthMarsDay = 1.027491252;
    const middDay1973 = 44796.0;
    const marsSolsDate = (julianDateSinceEpoch - midNightMatch) / diffEarthMarsDay + middDay1973 - midNightDiffCorrection;
    const marsHoursMTC = (24 * marsSolsDate) % 24; // mars Coordinated Time = mars UTC in hours
    const marsMTC = formatTIME(marsHoursMTC); // mars UTC but in hh:mm:ss format
    //orbital magic/sourcery
    const meanAnomally = (19.3870 + 0.52402075 * julianDateSinceEpoch) % 360;
    var fictitiusMarsSun = (270.3863 + 0.52403840 * julianDateSinceEpoch) % 360;
    const pbs =
        0.0071 * cos((0.985626 * julianDateSinceEpoch /  2.2353) +  49.409) +
        0.0057 * cos((0.985626 * julianDateSinceEpoch /  2.7543) + 168.173) +
        0.0039 * cos((0.985626 * julianDateSinceEpoch /  1.1177) + 191.837) +
        0.0037 * cos((0.985626 * julianDateSinceEpoch / 15.7866) +  21.736) +
        0.0021 * cos((0.985626 * julianDateSinceEpoch /  2.1354) +  15.704) +
        0.0020 * cos((0.985626 * julianDateSinceEpoch /  2.4694) +  95.528) +
        0.0018 * cos((0.985626 * julianDateSinceEpoch / 32.8493) +  49.095);
    const equationCenter = (10.691 + 3.0E-7 * julianDateSinceEpoch) * sin(meanAnomally) +
        0.623 * sin(2 * meanAnomally) +
        0.050 * sin(3 * meanAnomally) +
        0.005 * sin(4 * meanAnomally) +
        0.0005 * sin(5 * meanAnomally) +
        pbs;
    const lS = (fictitiusMarsSun + equationCenter) % 360;
    const eot = 2.861 * sin(2 * lS) - 0.071 * sin(4 * lS) + 0.002 * sin(6 * lS) - equationCenter; // ecuation of time
    const h_lambda = 0.042431; // for spirit and opportunity hybrid time

    switch (youAreHere) {
        case 'mars':
            seasonDOM.classList.add('hide');
            roverNameDOM.textContent = 'Planet';
            locationDOM.textContent = 'MARS';
            seasonDOM.textContent = getSeason(lS, 'N');
            updateTimeDisplay( marsMTC, 'MTC', '', marsSolsDate);
            break;

        case 'sojourner':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'Sojourner';
            locationDOM.textContent = 'Ares';
            locationTypeDOM.textContent = ' Vallis';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'N');
            //sojourner LTST
            const sojourner_lambda = 360 - 326.47; // or 33.25
            const sojourner_epochLT = 43905; //epoch landing time in sols - sol 0
            const sojournerMissionSol = Math.floor(marsSolsDate - sojourner_lambda / 360) - sojourner_epochLT;
            const sojourner_LMST = within_24(marsHoursMTC - sojourner_lambda * 24 / 360); // mission time in hours
            const sojourner_HLMST = formatTIME(sojourner_LMST); // mission time formatted hh:mm:ss
            const sojourner_LTST = within_24(sojourner_LMST + eot * 24 / 360); // Local True Solar Time in hours
            const sojourner_HLTST = formatTIME(sojourner_LTST); // Local True Solar Time formated hh:mm:ss
            updateTimeDisplay(sojourner_HLMST, 'LTST', sojourner_HLTST,sojournerMissionSol);
            break;

        case 'spirit':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'Spirit';
            locationDOM.textContent = 'Gusev';
            locationTypeDOM.textContent = ' Crater';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'S');
            //spirit HLST
            const spirit_epochLT = 46215; //epoch landing time in sols - sol 1
            const spirit_MissionSol = marsSolsDate - spirit_epochLT - h_lambda;
            const spirit_LMST = within_24((24 * spirit_MissionSol) % 24 + 12.02);
            // const spirit_LMST = within_24(marsHoursMTC - spirit_lambda * 24 / 360);
            const spirit_LTST = within_24(spirit_LMST + eot * 24 / 360);
            const spirit_LMSThhmmss = formatTIME(spirit_LMST);
            const spirit_LTSThhmmss = formatTIME(spirit_LTST);
            updateTimeDisplay(spirit_LMSThhmmss, 'HLST', spirit_LTSThhmmss, spirit_MissionSol);
            break;
            
        case 'opportunity':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'Opportunity';
            locationDOM.textContent = 'Meridiani';
            locationTypeDOM.textContent = ' Planum';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'S');
            //opportunity HLST
            const opportunity_lambda = 360 - 354.4734; //15.28
            const opportunity_epochLT = 46235; //epoch landing time in sols - sol 1
            const opportunity_MissionSol = marsSolsDate - opportunity_epochLT - h_lambda;
            const opportunity_LMST = (24 * opportunity_MissionSol) % 24;
            const opportunity_LTST = within_24(opportunity_LMST + eot * 24 / 360);
            const opportunity_LMSThhmmss = formatTIME(opportunity_LMST);
            const opportunity_LTSThhmmss = formatTIME(opportunity_LTST);
            //opportunity true solar time?
            const opp_LMST = within_24(marsHoursMTC - opportunity_lambda * 24 / 360);
            const opp_HLMST = formatTIME(opp_LMST); // mission time formatted hh:mm:ss
            const opp_LTST = within_24(opp_LMST + eot * 24 / 360); // Local True Solar Time in hours
            const opp_HLTST = formatTIME(opp_LTST); // Local True Solar Time formated hh:mm:ss
            updateTimeDisplay(opportunity_LMSThhmmss, 'HLST', opp_HLTST, opportunity_MissionSol);
            break;

        case 'insight':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'InSight';
            locationDOM.textContent = 'Elysium';
            locationTypeDOM.textContent = ' Planitia';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'N');
            weatherDOM.classList.remove('hide');
            insightWDOM.classList.remove('hide');
            curiosityWDOM.classList.add('hide');
            perseveranceWDOM.classList.add('hide');
            //insight LMST
            const insight_lambda = 360 - 135.97; //135.97 / 135.623
            const insight_epochLT = 51510; //epoch landing time in sols - sol 0
            const insightMissionSol = Math.floor(marsSolsDate - insight_lambda / 360) - insight_epochLT;
            const insight_LMST = within_24(marsHoursMTC - insight_lambda * 24 / 360); // mission time in hours
            const insight_HLMST = formatTIME(insight_LMST); // mission time formatted hh:mm:ss
            const insight_LTST = within_24(insight_LMST + eot * 24 / 360); // Local True Solar Time in hours
            const insight_HLTST = formatTIME(insight_LTST); // Local True Solar Time formated hh:mm:ss
            updateTimeDisplay(insight_HLMST, 'LMST', insight_HLTST, insightMissionSol);
            break;

        case 'curiosity':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'Curiosity';
            locationDOM.textContent = 'Gale';
            locationTypeDOM.textContent = ' Crater';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'S');
            weatherDOM.classList.remove('hide');
            insightWDOM.classList.add('hide');
            curiosityWDOM.classList.remove('hide');
            perseveranceWDOM.classList.add('hide');
            //curiosity LMST
            const curiosity_lambda = 360 - 137.4417; //137.42
            const curiosity_epochLT = 49268; //epoch landing time in sols - sol 0
            const curiosityMissionSol = Math.floor(marsSolsDate - curiosity_lambda / 360) - curiosity_epochLT;
            const curiosity_LMST = within_24(marsHoursMTC - curiosity_lambda * 24 / 360); // mission time in hours
            const curiosity_HLMST = formatTIME(curiosity_LMST); // mission time formatted hh:mm:ss
            const curiosity_LTST = within_24(curiosity_LMST + eot * 24 / 360); // Local True Solar Time in hours
            const curiosity_HLTST = formatTIME(curiosity_LTST); // Local True Solar Time formated hh:mm:ss
            updateTimeDisplay(curiosity_HLMST, 'LMST', curiosity_HLTST, curiosityMissionSol);
            break;
        
        case 'perseverance':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'Curiosity';
            locationDOM.textContent = 'Jezero';
            locationTypeDOM.textContent = ' crater';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'N');
            weatherDOM.classList.remove('hide');
            insightWDOM.classList.add('hide');
            curiosityWDOM.classList.add('hide');
            perseveranceWDOM.classList.remove('hide');
            //perseverance LMST
            const perseverance_lambda = 360 - 77.5031; //77.43
            const perseverance_epochLT = 52303; //epoch landing time in sols - sol 0
            const perseveranceMissionSol = Math.floor(marsSolsDate - perseverance_lambda / 360) - perseverance_epochLT;
            const perseverance_LMST = within_24(marsHoursMTC - perseverance_lambda * 24 / 360); // mission time in hours
            const perseverance_HLMST = formatTIME(perseverance_LMST); // mission time formatted hh:mm:ss
            const perseverance_LTST = within_24(perseverance_LMST + eot * 24 / 360); // Local True Solar Time in hours
            const perseverance_HLTST = formatTIME(perseverance_LTST); // Local True Solar Time formated hh:mm:ss
            updateTimeDisplay(perseverance_HLMST, 'LMST', perseverance_HLTST, perseveranceMissionSol);
            break;

        case 'ingenuity':
            seasonDOM.classList.remove('hide');
            roverNameDOM.textContent = 'Ingenuity';
            locationDOM.textContent = 'Jezero';
            locationTypeDOM.textContent = ' crater';
            locationDOM.appendChild(locationTypeDOM);
            seasonDOM.textContent = getSeason(lS, 'N');
            //ingenuity LMST
            const ingenuity_lambda = 360 - 77.43;
            const ingenuity_epochLT = 52303; //epoch landing time in sols - sol 0
            const ingenuityMissionSol = Math.floor(marsSolsDate - ingenuity_lambda / 360) - ingenuity_epochLT;
            const ingenuity_LMST = within_24(marsHoursMTC - ingenuity_lambda * 24 / 360); // mission time in hours
            const ingenuity_HLMST = formatTIME(ingenuity_LMST); // mission time formatted hh:mm:ss
            const ingenuity_LTST = within_24(ingenuity_LMST + eot * 24 / 360); // Local True Solar Time in hours
            const ingenuity_HLTST = formatTIME(ingenuity_LTST); // Local True Solar Time formated hh:mm:ss
            updateTimeDisplay(ingenuity_HLMST, 'LMST', ingenuity_HLTST, ingenuityMissionSol);
            break;

        default:
            break;
    }
}


function updateWeatherDisplay(rover) {
    weatherDOM.classList.add('hide');

    switch(rover){
        case 'insight':
            insightWDOM.classList.remove('hide');
            curiosityWDOM.classList.add('hide');
            perseveranceWDOM.classList.add('hide');
            weatherDOM.classList.remove('hide');
            break;

        case 'curiosity':
            insightWDOM.classList.add('hide');
            curiosityWDOM.classList.remove('hide');
            perseveranceWDOM.classList.add('hide');
            weatherDOM.classList.remove('hide');
            break;
        
        case 'perseverance':
            insightWDOM.classList.add('hide');
            curiosityWDOM.classList.add('hide');
            perseveranceWDOM.classList.remove('hide');
            weatherDOM.classList.remove('hide');
            break;
    }
}


function updateTimeDisplay(LMT, timeSys, LTST, SOL) {
    timeDOM.textContent = LMT.slice(0,5);
    const timeSpanDoM = document.createElement("SPAN");
    timeSpanDoM.textContent = timeSys;
    timeDOM.appendChild(timeSpanDoM);
    solDOM.textContent = `sol ${Math.floor(SOL)}`;
}


function getSeason(ls, hemisphere) {
    if (ls >= 0 && ls <90) {
        return (hemisphere === 'N') ? 'spring season' : 'autumn season';
    }
    if (ls >= 90 && ls <180) {
        return (hemisphere === 'N') ? 'summer season' : 'winter season';
    }
    if (ls >= 180 && ls <270) {
        return (hemisphere === 'N') ? 'autumn season' : 'spring season';
    }
    if (ls >= 270 && ls <360) {
        return (hemisphere === 'N') ? 'winter season' : 'summer season';
    }
}


////////////
//UTILITIES
/*
* @description format martian hours to hh:mm:ss
* @param {number} timeinhours
* @return {string} formatted time
*/
function formatTIME(timeinhours) {
    const os = timeinhours * 3600;
    let hours = Math.floor(os / 3600);
    if (hours < 10) hours = "0" + hours;
    const year = os % 3600;
    let month = Math.floor(year / 60);
    if (month < 10) month = "0" + month;
    var seconds = Math.round(year % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return hours + ":" + month + ":" + seconds;
}
/*
* @description cosine of an angle
* @param {deg} angle in degree
* @return {number} cosine
*/
function cos(deg) {
    return Math.cos(deg * Math.PI / 180);
}

/*
* @description sine of an angle
* @param {number} deg angle in degree
* @return {number} sine
*/
function sin(deg) {
    return Math.sin(deg * Math.PI / 180);
}

/*
* @description keeps time between a 24 hours range
* @param {number} n
* @return {number} n in range
*/
function within_24(n) {
    if (n < 0) {
        n += 24;
    } else if (n >= 24) {
        n -= 24;
    }
    return n;
}

/*
* @description stops time interval
*/
function stopTime() {
    clearInterval(timeInterval);
}