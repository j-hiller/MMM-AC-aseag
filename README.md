# MMM-AC-aseag

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).
It display the realtime departures of busses in Aachen using the API provided by the ASEAG. The module is still work in progress.  

This is my first module for the MagicMirror and my first project in js, so feel free to contribute or comment.


## Installation
1. Navigate into your MagicMirror's `modules` folder and excecute `git clone https://github.com/neandertaler19/MMM-AC-aseag`
2. Navigate into the newly created folder.
3. Execute `npm install`to install the node dependencies.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
{
    module: "MMM-AC-aseag",
    position: "bottom_left",
    header: "Misereor Abfahrten",
    config: {
        retryDelay: 5 * 1000, // Time to wait before retrying in case of failure
        maximumEntries: 10, // Maximum number of entries shown in table
        updateInterval: 1 * 60 * 1000, // Update interval in microseconds
        stop: "",
        stopID: 100010, // ID of the stop
    }
},

```

## Configuration options

| Option           | Description
|----------------- |-----------
| `retryDelay`        | *optional* TIme to wait before retrying in case of failure
| `maximumEntries`| *optional* Maximum number of entries shown in the table
| `updateInterval`        | *optional* Update interval for querying for new connections <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
| `stop` | *optional* name of the stop. If you don't provide this information, you should leave it empty (`""`) and provide a stopID instead
| `stopID` | *optional* ID of the stop


## Acknowledgements
* [busplan](https://github.com/johschmitz/busplan)
* [MMM-HH-localtransport](https://github.com/georg90/MMM-HH-LocalTransport)
* [MMM-DWD-WarnWeather](https://github.com/LukeSkywalker92/MMM-DWD-WarnWeather)
