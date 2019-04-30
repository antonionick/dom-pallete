import Events from "./events.js";

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

export default ColorEvents;
