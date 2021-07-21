'use strict'

const topBar = document.querySelector('.topbar');
const errBar = document.querySelector('.errbar');

const getPosition = function () {
	//returns a promise using the geolocation API that is not a promise
	//but still is an asynchronous function
	return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
		navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const test = async function() {
	try {
		const pos = await getPosition();
		//if(!pos.ok) throw new Error('Navigator.geolocation error');
		//console.log(pos)
		
		//decosntruct to rename variables
		const {latitude: lat, longitude: lng} = pos.coords;
		//const lat = 52.237049;
		//const lng =  21.017532;
		
		//fetching data from reverse geolocation API 
		const revGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
		if(!revGeo.ok) throw new Error('Reverse geolocation error');
		
		const revGeoJSON = await revGeo.json();
		//console.log(revGeoJSON);
		const city = revGeoJSON.city;
		const state = revGeoJSON.principalSubdivision;
		const country = revGeoJSON.countryName;
		
		//fetching data from 7timer API for weather report
		const res = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lat}&product=civillight&output=json`);
		if(!res.ok) throw new Error('7timer error');
		
		const weatherJSON = await res.json();
		const weather = weatherJSON.dataseries;
		//console.log(weather);
		
		let html = `<p>7timer: 7 day weather forecast</p>
					<p>BigDataCloud: Reverse Geolocation</p>
					<p>Current Location: ${city} - ${state} - ${country}</p>
					<hr>`;

		weather.forEach(function(item){
			html += `
				<p>Date: ${formatDate(item.date)}</p>
				<p>Weather: ${item.weather}</p>
				<p>Max: ${item.temp2m.max}°C</p>
				<p>Min: ${item.temp2m.min}°C</p>
				<hr>`;
		});
		
		topBar.insertAdjacentHTML('beforeend', html);
		
	} catch(err) {
		console.log(err.message);
		errBar.insertAdjacentHTML('beforeend', err.message);
	}
}

const formatDate = function(date) {
	const dateStr = String(date);
	
	const year = dateStr.slice(0,4);
	const month = dateStr.slice(4,6);
	const day = dateStr.slice(6,8);
	
	return `${day}/${month}/${year}`;
}

test();