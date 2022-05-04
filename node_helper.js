/* Magic Mirror
 * Node Helper: MMM-AC-aseag
 *
 * By neandertaler19
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var axios = require("axios").default;

module.exports = NodeHelper.create({

	updateTimetable: function(stopID) {
		var self = this;
		let mockData = [
			{
			  timestamp: '2022-05-02 13:20',
			  arrival: 10,
			  name: 'Linie E',
			  track: 'H.2',
			  direction: 'Europadorf'
			},
			{
			  timestamp: '2022-05-02 13:22',
			  arrival: 12,
			  name: 'Linie 3B',
			  track: 'H.5',
			  direction: 'Hauptbahnhof - Schanz - Uniklinik'
			},
			{
			  timestamp: '2022-05-02 13:24',
			  arrival: 14,
			  name: 'Linie 43',
			  track: 'H.1',
			  direction: 'Aachen Bushof - Uniklinik'
			},
			{
			  timestamp: '2022-05-02 13:24',
			  arrival: 14,
			  name: 'Linie 47',
			  track: 'H.1',
			  direction: 'Hüls Schulzentrum'
			},
			{
			  timestamp: '2022-05-02 13:25',
			  arrival: 15,
			  name: 'Linie 43',
			  track: 'H.2',
			  direction: 'Laurensberg Rahe Im Ring'
			},
			{
			  timestamp: '2022-05-02 13:25',
			  arrival: 15,
			  name: 'Linie 27',
			  track: 'H.2',
			  direction: 'Kohlscheid Bank'
			},
			{
			  timestamp: '2022-05-02 13:25',
			  arrival: 15,
			  name: 'Linie 33',
			  track: 'H.1',
			  direction: 'Fuchserde'
			},
			{
			  timestamp: '2022-05-02 13:26',
			  arrival: 16,
			  name: 'Linie 73',
			  track: 'H.2',
			  direction: 'Campus Melaten - Uniklinik'
			},
			{
			  timestamp: '2022-05-02 13:27',
			  arrival: 17,
			  name: 'Linie 37',
			  track: 'H.1',
			  direction: 'Normaluhr (Ronheider Weg)'
			},
			{
			  timestamp: '2022-05-02 13:29',
			  arrival: 19,
			  name: 'Linie 13B',
			  track: 'H.5',
			  direction: 'Hauptbahnhof - Schanz - Ponttor'
			},
			{
			  timestamp: '2022-05-02 13:30',
			  arrival: 20,
			  name: 'Linie 147',
			  track: 'H.2',
			  direction: 'Schnellbus Merkstein'
			},
			{
			  timestamp: '2022-05-02 13:30',
			  arrival: 20,
			  name: 'Linie 17',
			  track: 'H.2',
			  direction: 'Locht Zollmuseum'
			},
			{
			  timestamp: '2022-05-02 13:30',
			  arrival: 20,
			  name: 'Linie 7',
			  track: 'H.2',
			  direction: 'Richterich Schönau'
			}
		  ];
		  
					
		  
		self.sendSocketNotification("BUSSES", mockData);
		
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
