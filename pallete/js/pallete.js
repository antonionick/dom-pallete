import ColorEvents from "./colorEvents.js";

class Action {
    constructor() {
        this.action = null;
    }

    setLastValues() {
        const currentColor = document.getElementById("current-color").querySelector(".list__color");
        const previousColor = document.getElementById("previous-color").querySelector(".list__color");

        currentColor.style.background = "lightgrey";
        previousColor.style.background = "#15ec15";
    }
}

const action = new Action;
action.setLastValues();
const colorEvents = new ColorEvents(action, document);
colorEvents.startEvents();
