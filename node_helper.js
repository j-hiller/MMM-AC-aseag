/* Magic Mirror
 * Node Helper: MMM-AC-aseag
 *
 * By neandertaler19
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var axios = require("axios").default;

module.exports = NodeHelper.create({

	updateTimetable: async function(stopID) {
		var self = this;
		
		let options = {
			method: 'GET',
			url: 'http://dev.serwm.com:4000/depatureboard/' + stopID,
		};
	
		let busses = [];
		
		await axios.request(options).then(function (response){
			busses = response.data;
		})

		self.sendSocketNotification("BUSSES", busses);
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
	},
});
