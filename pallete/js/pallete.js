import ColorEvents from "./colorEvents.js";
import ToolsEvents from "./toolsEvents.js";

class Action {
    constructor() {
        this.action = null;
        this.onmove = false;
        this.currentColor = document.getElementById("current-color").querySelector(".list__color");
        this.previousColor = document.getElementById("previous-color").querySelector(".list__color");
    }

    setLastValues() {
        this.currentColor.style.background = "lightgrey";
        this.previousColor.style.background = "#15ec15";
    }
}

const action = new Action;
action.setLastValues();
const colorEvents = new ColorEvents(action, document);
colorEvents.startEvents();
const toolsEvents = new ToolsEvents(action, document);
toolsEvents.startEvents();
