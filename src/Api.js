/* eslint-disable class-methods-use-this, no-unused-vars */
class Api {
  insertItem(object) { }
  deleteItem(id) { }
  purchaseItem(data) { }
  updateItem(object, id) { }
  insertMenuItem(object) { }
  reconcile(itemStock) { }
  insertTable(table) {}
  placeOrder(tableId, orderItems, discount = 0, remarks = '') {}
  updateOrder(orderId, tableId, orderItems, discount = 0, remarks = '') {}
}

export default Api;
