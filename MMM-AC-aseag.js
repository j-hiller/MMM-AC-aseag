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
		stop: "Misereor",	// The name of the stop. If you leave this empty, the ID will be used
		stopID: 100010, // Stop for displaying the departures
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		// Initialize the bus array
		this.busses = [];
		this.loaded = false;
		this.updateTimer = null;
		// If a name is provided, get it's ID
		if (this.config.stop != "") {
			this.sendSocketNotification("GET_ID", this.config.stop);
		} else {
			// If not, directly use the ID and update the departures
			this.updateBusses(this);
		}
	},

	updateBusses: function (self) {
		// Call the helper to get the busses
		self.sendSocketNotification('GET_BUSSES', self.config.stopID);
		// Configure it to be called every *updateInterval* minute
		setTimeout(self.updateBusses, self.config.updateInterval, self);		
	},

	getDom: function() {
		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		// The ID is too low to be correct
		if (this.config.id < 100000) {
			wrapper.innerHTML = "The ID " +this.id + " provided is not correct";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// Display text while loading the connections
		if (!this.loaded) {
			wrapper.innerHTML = "Loading connections ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// Display the departures in a table
		var table = document.createElement("table");
		table.className = "small";
		// The current time
		var current = Date.now();

		for (var b in this.busses) {
			if (b > this.config.maximumEntries) {
				break;
			}
			// Define the subarray for quick access
			var bus = this.busses[b];
			var departure = new Date(bus[3]).getTime();
			var remaining = Math.round((departure - current)/1000/60);

			// Create a new row in the table
			var row = document.createElement("tr");
			table.appendChild(row);

			// Fill it with the line number
			var lineCell = document.createElement("td");
			lineCell.className = "align-right bright";
			lineCell.innerHTML = bus[1];
			row.appendChild(lineCell);

			// Fill it with the destination
			var toCell = document.createElement("td");
			toCell.classname = "align-right trainto"
			toCell.innerHTML = bus[2];
			row.appendChild(toCell);

			// Fill it with the departure time
			var depCell = document.createElement("td");
			depCell.className = "departuretime";
			if (remaining <= 0){
				depCell.innerHTML = "now";
			} else {
				depCell.innerHTML = remaining + " min";
			}
			row.appendChild(depCell);
		}
		return table;
	},

	getStyles: function () {
		return ["MMM-AC-aseag.css"];
	},

	// socketNotificationReceived from helper
	// Not used at the moment
	socketNotificationReceived: function (notification, payload) {
		if (notification == "BUSSES") {
			this.busses = payload;
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
		if (notification == "RETURN_ID") {
			this.config.stopID = payload;
			Log.info("Stop ID: " + payload);
			this.updateBusses(this);
		}
	},
});
