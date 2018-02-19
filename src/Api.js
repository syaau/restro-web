/* eslint-disable class-methods-use-this, no-unused-vars */
class Api {
  insertItem(object) { }
  deleteItem(id) { }
  purchaseItem(data) { }
  updateItem(object, id) { }
  insertMenuItem(object) { }
  updateMenuItem(menuitem, id) {}
  deleteMenuItem(id) {}
  reconcile(itemStock) { }
  insertTable(table) {}
  updateTable(obj, id) {}
  deleteTable(id) {}
  placeOrder(tableId, orderItems, discount = 0, remarks = '') {}
  updateOrder(orderId, tableId, orderItems, discount = 0, remarks = '') {}
  cancelOrder(orderId) {}
  completeOrder(orderId) {}
  insertUser(user) {}
}

export default Api;
