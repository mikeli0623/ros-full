import React from "react";
import { Table } from "react-bootstrap";
import "../styles/MyOrders.scss";

export default function MyOrdersItem({ items, total }) {
  return (
    <div className="order-item">
      <Table striped bordered>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
        </thead>
        {items.map((item) => {
          return (
            <tbody key={item.name}>
              <tr>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>${item.cost.toFixed(2)}</td>
              </tr>
            </tbody>
          );
        })}
      </Table>
      <p className="item-listing">Total Cost: ${total.toFixed(2)}</p>
    </div>
  );
}
