/* Magic Mirror
 * Node Helper: MMM-AC-aseag
 *
 * By neandertaler19
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({

	updateTimetable: function(stopID) {
		var self = this;
		// URL for querying the bus stop departures
		var urlApi = "http://ivu.aseag.de/interfaces/ura/instant_V2?ReturnList=LineName,DestinationText,EstimatedTime&StopID=" + stopID;

		// Send a request for the departures
		request({
			url: urlApi,
			method: "GET"
		}, function(error, response, body) {
			// Repair the JSON
			var str = "[" + body.split("\n").slice(1).join(",") + "]";
			// Parse the result
			var jsonObj = JSON.parse(str);
			// Sort the array by the departure
			jsonObj.sort(function(a, b) {
				if (a[3] == b[3]) {
					return 0;
				}
				if (a[3] < b[3]) {
					return -1;
				}
				if (a[3] > b[3]) {
					return 1;
				}
			});
			// Send it back to the main function
			self.sendSocketNotification("BUSSES", jsonObj);
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
			self.updateTimetable(payload);
		}
		if (notification == "GET_ID") {
			self.extractID(payload);
		}
	},
});
