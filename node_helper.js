/* Magic Mirror
 * Node Helper: MMM-AC-aseag
 *
 * By joshua-martius
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var axios = require("axios").default;
var moment = require("moment");

module.exports = NodeHelper.create({

	updateTimetable: async function(accessID, stopID) {
		var self = this;
		
		var options = {
			method: 'GET',
			url: 'https://demo.hafas.de/avv-aachen/restproxy/departureBoard',
			params: {
			  id: stopID,
			  accessId: accessID,
			  format: 'json',
			  lang: 'de',
			  maxJourneys: '100'
			}
		};
		
		let busses = [];
		await axios.request(options).then(function (response) {
			let raw = response.data;
			let departures = raw.Departure;
		
			departures.forEach(e => {
				if(!e.reachable) return;
				let bus = {};
				bus.arrival = moment(e.date + " " + e.time).diff(moment(), "minutes")
				bus.track = e.track.substring(0,3);
		
				if(bus.arrival < 5 || bus.arrival > 15) return;
				bus.name = e.ProductAtStop.name.replace(/  +/g, ' ') + " (" + bus.track + ")";
				bus.direction = e.direction.replace(/ - /g, "-");
				busses.push(bus)
			})
			
			//console.debug("Sending back " + busses.length + " Busses!")
		}).catch(function (error) {
			console.log("Error in AVV-API Request! " + error);
			console.error(options)
		});
	
		self.sendSocketNotification("BUSSES", busses);
	},

	socketNotificationReceived: function(notification, payload) {
		const self = this;
		if (notification == "GET_BUSSES") {
			self.updateTimetable(payload.accessID, payload.stopID);
		}
	},
});
