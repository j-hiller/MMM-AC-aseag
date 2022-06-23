/* global Module */

/* Magic Mirror
 * Module: MMM-AC-aseag
 *
 * By neandertaler19
 * MIT Licensed.
 */

Module.register("MMM-AC-aseag", {
	defaults: {
		retryDelay: 5000,	// Delay for retrying
		maximumEntries: 10, // Maximum entries shown
		updateInterval: 1 * 60 * 1000, // Update every minute.
		stopID: 1055, // Stop for displaying the departures
		accessID: "access-id-here"
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		// Initialize the bus array
		this.busses = [];
		this.loaded = false;
		this.updateTimer = null;
		// let accessID = 
		this.updateBusses(this.config.accessID, this.config.stopID);
	},

	updateBusses: function (self) {
		// Call the helper to get the busses
		let payload = {"stopID": this.config.stopID, "accessID": this.config.accessID};
		this.sendSocketNotification('GET_BUSSES', payload);
		// Configure it to be called every *updateInterval* minute
		setTimeout(self.updateBusses, this.config.updateInterval, self);		
	},

	getDom: function() {
		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		// Display text while loading the connections
		if (!this.loaded) {
			wrapper.innerHTML = "Loading connections ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// Display the departures in a table
		var table = document.createElement("table");
		table.className = "small";

		this.busses.forEach(b => {
			// Create a new row in the table
			var row = document.createElement("tr");
			table.appendChild(row);
	
			// Fill it with the line number
			var lineCell = document.createElement("td");
			lineCell.className = "align-right bright";
			lineCell.innerHTML = b.name;
			row.appendChild(lineCell);
	
			// Fill it with the destination
			var toCell = document.createElement("td");
			toCell.classname = "align-right trainto"
			toCell.innerHTML = b.direction;
			row.appendChild(toCell);
	
			// Fill it with the departure time
			var depCell = document.createElement("td");
			depCell.className = "departuretime";
			depCell.innerHTML = b.arrival + " min";
			
			row.appendChild(depCell);
		})
		return table;
	},

	getStyles: function () {
		return ["MMM-AC-aseag.css"];
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification == "BUSSES") {
			this.busses = payload;
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
	},
});
