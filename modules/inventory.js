// modules/Inventory.js
export default class Inventory {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemName) {
        this.items = this.items.filter(item => item !== itemName);
    }

    hasItem(itemName) {
        return this.items.includes(itemName);
    }

    listItems() {
        return this.items;
    }
}
