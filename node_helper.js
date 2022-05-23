/* Magic Mirror
 * Node Helper: MMM-AC-aseag
 *
 * By neandertaler19
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var axios = require("axios").default;
var moment = require("moment")

module.exports = NodeHelper.create({

	updateTimetable: function(stopID, accessId) {
		var self = this;
		
		console.log("[MMM-ASEAG] Updating stop " + stopID + " with accessId " + accessId)

		var options = {
			method: 'GET',
			url: 'https://demo.hafas.de/avv-aachen/restproxy/departureBoard',
			params: {
				id: stopID,
				accessId: accessId,
				format: 'json',
				lang: 'de',
				maxJourneys: '100'
			}
		};
		  
		let busses = [];
		axios.request(options).then(function (response) {
			let raw = response.data;
			let departures = raw.Departure;
		
			departures.forEach(e => {
				if(!e.reachable) return;
				let bus = {};
				bus.arrival = moment(e.date + " " + e.time).diff(moment(), "minutes")
		
				if(bus.arrival < 5 || bus.arrival > 15) return;
				bus.name = e.Product.name.replace(/  +/g, ' ').replace("Bus", "");
				bus.track = e.track.substring(0,3);
				bus.direction = e.direction;
				busses.push(bus)
			})
			
		}).catch(function (error) {
			console.error("Error in AVV API Request");
		}).finally(function(){
			self.sendSocketNotification("BUSSES", busses);
		});

	},

	extractID: function(name) {
		var self = this;
		// URL for querying the ID for the stop name
		var urlLoc = "http://ivu.aseag.de/interfaces/ura/location?maxResults=10&searchTypes=STOPPOINT&searchString=" + name;

		// Send a request for the stop name
		request({
			url: urlLoc,
			method: "GET"
		}, function(error, repsonse, body) {
			// Prase the result
			jsonObj = JSON.parse(body);
			// Read out the stop name
			var ID = jsonObj["resultList"][0]["stopPointId"];
			// Send the name back to main function
			self.sendSocketNotification("RETURN_ID", ID);
		});
	},

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		const self = this;
		if (notification == "GET_BUSSES") {
			self.updateTimetable(payload.config.stopID, payload.config.accessId);
		}
		if (notification == "GET_ID") {
			self.extractID(payload);
		}
	},
});
