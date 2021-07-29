'use strict'

const topBar = document.querySelector('.topbar');
const errBar = document.querySelector('.errbar');

const arrDay = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const condicoes = {
	clearday: "limpo",
	clearnight: "limpo",
	pcloudyday: "nuvens esparsas",
	pcloudynight: "nuvens esparsas",
	mcloudyday: "parcialmente nublado",
	mcloudynight: "parcialmente nublado",
	cloudyday: "nublado",
	cloudynight: "nublado",
	humidday: "parcialmente nublado ",
	humidnight: "parcilamente nublado",
	lightrainday: "chuvas leves",
	lightrainnight: "chuvas leves",
	oshowerday: "chuvas ocasionais",
	oshowernight: "chuvas ocasionais",
	ishowerday: "chuvas ocasionais",
	ishowernight: "chuvas ocasionais",
	lightsnowday: "neve leve", 
	lightsnownight: "neve leve",
	rainday: "chuva",
	rainnight: "chuva",
	snowday: "neve",
	snownight: "neve",
	rainsnowday: "granizo",
	rainsnownight: "granizo",
	tsday: "raios",
	tsnight: "raios",
	tsrainday: "chuva e raios",
	tsrainnight: "chuva e raios"
}

const getNavPos = function() {
	return new Promise(function(resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

//const lat = -27.954183;
//const lng = -49.877898;

const getWeatherJSON = async function(navPos) {
	try {
		const {latitude: lat, longitude: lng} = navPos.coords;
		const weather = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lat}&product=civil&output=json`);
		const weatherJSON = await weather.json();
		return weatherJSON;
	} 
	catch (err) {
		console.log(err.message);
	}
}

const getGeoJSON = async function(navPos) {
	try {
		const {latitude: lat, longitude: lng} = navPos.coords;
		const revGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=pt`);
		const revGeoJSON = await revGeo.json();
		return revGeoJSON;
	}
	catch (err) {
		console.log(err.message);
	}
}

const updateHtml = function(revGeoJSON, weatherJSON) {
	const city = revGeoJSON.city ? revGeoJSON.city : revGeoJSON.locality + "*";
	const state = revGeoJSON.principalSubdivision;
	const country = revGeoJSON.countryName;
	const weather = weatherJSON.dataseries;
	const initialTime = formatTime(weatherJSON.init);
	
	let html = `<p>7timer: API de Previsão de Tempo<br>
				BigDataCloud: API de Geolocalização Reversa</p>
				<hr>
				<p>Localização*: ${city} - ${state} - ${country}<br>
				<font size = "-2">*Aproximação, pode conter erros</font>
				<hr>
				</p>`;

	weather.forEach(function(item){
		html += `
			<hr>
			<p>Data: ${formatDate(formatTime(weatherJSON.init, item.timepoint-3))}<br>
			Tempo: ${condicoes[item.weather]}<br>
			Temperatura: ${formatNumber(item.temp2m)}°C &nbsp &nbsp Umidade: ${item.rh2m}</p>`;
	});
	
	topBar.insertAdjacentHTML('beforeend', html);
}

const formatDate = function(data) {
	
	return `${arrDay[data.getDay()]}, ${formatNumber(data.getDate())}/${formatNumber(data.getMonth()+1)}/${data.getFullYear()}, ${formatNumber(data.getHours())}:00`;
}

const formatTime = function(date, offset = 0) {
	
	const year = date.slice(0,4);
	const month = date.slice(4,6);
	const day = date.slice(6,8);
	const hour = date.slice(-2);
	
	const d = new Date(Number(year), Number(month)-1, Number(day), Number(hour) + offset, 0, 0);
	
	return d;
}

const formatNumber = function(n) {
	if (n < 10 && n > -1)
		return (('0'+n).slice(-2))
	else
		return n;
}

const main = async function() {
	try {
		const navPos = await getNavPos();
		const geo = await getGeoJSON(navPos);
		const weath = await getWeatherJSON(navPos);
		console.log(navPos, geo, weath);
		
		updateHtml(geo, weath);
	}
	catch (err) {
		console.log(err.message)
	}
}

main();

// const getPosition = function () {
	// //returns a promise using the geolocation API that is not a promise
	// //but still is an asynchronous function
	// return new Promise(function (resolve, reject) {
    // // navigator.geolocation.getCurrentPosition(
    // //   position => resolve(position),
    // //   err => reject(err)
    // // );
		// navigator.geolocation.getCurrentPosition(resolve, reject);
  // });
// };

// const main = async function() {
	// try {
		// const pos = await getPosition();
		// //if(!pos.ok) throw new Error('Navigator.geolocation error');
		// //console.log(pos)
		
		// //decosntruct to rename variables
		// const {latitude: lat, longitude: lng} = pos.coords;
		// //const lat = -15.644514;
		// //const lng = -47.848138;
		
		// //fetching data from reverse geolocation API 
		// const revGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=pt`);
		// if(!revGeo.ok) throw new Error('Erro ao usar geolocalização reversa');
		
		// const revGeoJSON = await revGeo.json();
		// console.log(revGeoJSON);
		// const city = revGeoJSON.city ? revGeoJSON.city : revGeoJSON.locality + "*";
		// const state = revGeoJSON.principalSubdivision;
		// const country = revGeoJSON.countryName;
		
		// //fetching data from 7timer API for weather report
		// const res = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lat}&product=civillight&output=json`);
		// if(!res.ok) throw new Error('Erro na previsão');
		
		// const weatherJSON = await res.json();
		// const weather = weatherJSON.dataseries;
		// console.log(weather);
		
		// let html = `<p>7timer: API de previsão de tempo<br>
					// BigDataCloud: API de geolocalização reversa</p>
					// <hr>
					// <p>Localização*: ${city} - ${state} - ${country}<br>
					// <font size = "-2">* closest approximation, errors may occur</font></p>`;

		// weather.forEach(function(item){
			// html += `
				// <hr>
				// <p>Data: ${formatDate(item.date)}<br>
				// Tempo: ${item.weather}<br>
				// Mín: ${formatNumber(item.temp2m.min)}°C &nbsp &nbsp &nbsp Máx: ${formatNumber(item.temp2m.max)}°C</p>`;
		// });
		
		// topBar.insertAdjacentHTML('beforeend', html);
		
	// } catch(err) {
		// console.log(err.message);
		// errBar.insertAdjacentHTML('beforeend', err.message);
	// }
// }

// const formatDate = function(date) {
	// const dateStr = String(date);
	
	// const year = dateStr.slice(0,4);
	// const month = dateStr.slice(4,6);
	// const day = dateStr.slice(6,8);
	
	// const dayWeek = new Date(`${month}/${day}/${year}`);
	
	// return `${day}/${month}/${year}, ${arrDay[dayWeek.getDay()]}`;
// }

// const formatNumber = function(n) {
	// if (n < 10 && n > -1)
		// return (('0'+n).slice(-2))
	// else
		// return n;
// }

// main();