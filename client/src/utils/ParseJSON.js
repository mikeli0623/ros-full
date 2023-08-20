class ParseJSON {
  constructor() {
    this.categoryJSON = require(`../data/categories.json`);
    this.itemJSON = require(`../data/items.json`);
    this.cartItemJSON = require(`../data/cartItems.json`);
    this.orderJSON = require(`../data/orders.json`);
  }

  getCategoryNames() {
    let categories = [];
    for (const key of this.categoryJSON) {
      categories.push(key.name);
    }
    return categories;
  }

  getCategoryItems(name) {
    for (const key of this.categoryJSON) {
      if (key.name === name) return key.items;
    }
  }

  getCategoryPattern(name) {
    for (const key of this.categoryJSON) {
      if (key.name === name) {
        let objList = [];
        for (const item of key.items) {
          for (const k of this.itemJSON) {
            if (k.name === item)
              objList.push({
                name: item,
                ingredients: k.ingredients.join(" "),
              });
          }
        }
        return objList;
      }
    }
  }

  getOtherCategoryPattern(name) {
    let objListList = [];
    for (const key of this.categoryJSON) {
      if (key.name !== name) {
        objListList.push({
          category: key.name,
          pattern: this.getCategoryPattern(key.name),
        });
      }
    }
    return objListList;
  }

  getItemInfo(name) {
    for (const key of this.itemJSON) {
      if (key.name === name) return key;
    }
  }
}

export default ParseJSON;
