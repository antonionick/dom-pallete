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
    }
}

export default Events;
