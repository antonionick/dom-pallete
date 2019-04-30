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

class Events {
    constructor(action, document) {
        this._type = action;
        this.document = document;
    }

    _changeCurrentColor(color, current) {
        const currentColor = document.getElementById("current-color").querySelector(".list__color");
        const previousColor = document.getElementById("previous-color").querySelector(".list__color");
        if (!currentColor || !previousColor) return;

        previousColor.style.background = current || currentColor.style.background;
        currentColor.style.background = color;
    }

    _searchParent(e) {
        let elem = e.target;

        while (!elem.dataset.type && elem !== e.currentTarget) {
            elem = elem.parentElement;
        }

        return elem === e.currentTarget ? null : elem;
    }

    _changeAction(elem) {
        this._removeAction();
        this._type.action = elem.dataset.type;
        elem.classList.add("list__item_selected");
    }

    _removeAction() {
        const list = this.document.querySelector(".list__item_selected");
        if (list) {
            list.classList.remove("list__item_selected");
        }
        this._type.action = null;

        if (this._type.onmove) {
            document.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            this._type.onmove = false;
        }
    }
}

class ColorEvents extends Events {
    constructor(action, document) {
        super(...arguments);
    }

    startEvents() {
        const chooseColor = this.document.getElementById("choose-color");
        const colorBlock = this.document.getElementById("colors");

        chooseColor.onclick = this._chooseColor.bind(this);
        colorBlock.onclick = this._selectColor.bind(this);
    }

    _selectColor(e) {
        const elem = this._searchParent(e);
        if (!elem) return;

        const styles = getComputedStyle(elem.querySelector(".list__color"));
        this._changeCurrentColor(styles.backgroundColor);

        this._removeAction();
    }

    _chooseColor(e) {
        const elem = e.currentTarget.querySelector(".list__color"),
            current = this.document.getElementById("current-color").querySelector(".list__color").style.backgroundColor;
        let open = true;

        elem.addEventListener('focus', e => {
            if (!open) {
                setTimeout(() => {
                    this._changeCurrentColor(elem.value, current);
                    this._removeAction();

                }, 10);
            }
        });

        elem.addEventListener('blur', () => {
            open = !open;
        });


        if (!e.target.classList.contains("list__color")) {
            elem.click();
            elem.focus();
        }
    }

    _removeAction() {
        if (this._type.action === "change_color") {
            super._removeAction();
        }
    }
}

class ToolsEvents extends Events {
    constructor(action, document) {
        super(...arguments);
        this._tools = [];
        this._toolsBlocks = [];
    }

    startEvents() {
        this._toolsBlocks = this.document.getElementById("tools");
        this._tools = [].map.call(this._toolsBlocks.querySelectorAll(".list > .list__item"), item => {
            return item.dataset.type;
        });

        this._toolsBlocks.onclick = this._selectTools.bind(this);
        this.document.documentElement.addEventListener("click", this._clickHandler.bind(this));
        this.document.documentElement.addEventListener("keypress", this._selectKey.bind(this));

    }

    _selectKey(e) {
        switch (e.charCode) {
            case 112:
            case 80: this._toolsBlocks.querySelectorAll(".list__item")[0].click();
                break;
            case 99:
            case 67: this._toolsBlocks.querySelectorAll(".list__item")[1].click();
                break;
            case 109:
            case 77: this._toolsBlocks.querySelectorAll(".list__item")[2].click();
                break;
            case 116:
            case 84: this._toolsBlocks.querySelectorAll(".list__item")[3].click();
                break;
        }
    }

    _selectTools(e) {
        const elem = this._searchParent(e);
        if (!elem) return;
        if (elem.classList.contains("list__item_selected")) {
            this._removeAction();
        } else {
            this._changeAction(elem);
        }
    }

    _clickHandler(e) {
        const elem = this._searchParent(e);
        if (!elem) return;

        this._tools.forEach(item => {
            if (item === this._type.action) {
                this["_" + item + "Tools"](elem);
            }
        })
    }

    _paint_bucketTools(elem) {
        if (elem.classList.contains("list__item")) return;
        elem.style.background = this._type.currentColor.style.backgroundColor;
    }

    _change_colorTools(elem) {
        if (this._tools.indexOf(elem.dataset.type) !== -1) return;
        this._changeCurrentColor(getComputedStyle(elem).backgroundColor);
        this._removeAction();
    }

    _moveTools(elem) {
        this._type.onmove = true;

        function capturing(e) {
            const elem = e.target;
            if (!elem.classList.contains("canvas__figure")) return;

            const coords = elem.getBoundingClientRect(),
                y = coords.top - e.clientY,
                x = coords.left - e.clientX;
            elem.style.position = "fixed";

            elem.style.top = e.clientY + y + "px";
            elem.style.left = e.clientX + x + "px";
            elem.ondragstart = function () {
                return false;
            };

            document.onmousemove = function (e) {
                elem.style.top = e.clientY + y + "px";
                elem.style.left = e.clientX + x + "px";
            };

            document.onmouseup = e => {
                this._type.onmove = false;
                document.onmousedown = null;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }

        document.onmousedown = capturing.bind(this);
    }

    _transformTools(elem) {
        if (elem.classList.contains("list__item")) return;
        elem.classList.toggle("canvas__figure_circle");
    }
}

const action = new Action;
action.setLastValues();
const colorEvents = new ColorEvents(action, document);
colorEvents.startEvents();
const toolsEvents = new ToolsEvents(action, document);
toolsEvents.startEvents();
