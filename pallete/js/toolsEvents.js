import Events from "./events.js";

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

export default ToolsEvents;
