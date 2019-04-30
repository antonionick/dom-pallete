import Events from "./events.js";

class ToolsEvents extends Events {
    constructor(action, document) {
        super(...arguments);
        this._tools = [];
    }

    startEvents() {
        const toolsBlock = this.document.getElementById("tools");
        this._tools = [].map.call(toolsBlock.querySelectorAll(".list > .list__item"), item => {
            return item.dataset.type;
        });

        toolsBlock.onclick = this._selectTools.bind(this);
        this.document.documentElement.addEventListener("click", this._clickHandler.bind(this));
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
