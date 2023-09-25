import "../styles/MyOrders.scss";
import MyOrdersDropdown from "./MyOrdersDropdown";
import { storage } from "utils/storage";
import * as constants from "../utils/constants";
import useFetch from "./hooks/useFetch";

export default function ViewOrder() {
  const { data: inProgressOrders } = useFetch(
    `https://ros-api.onrender.com/api/orders?restId=${constants.restaurantId}&customerId=${storage.custId}&inProgress=true`
  );

  const { data: completedOrders } = useFetch(
    `https://ros-api.onrender.com/api/orders?restId=${constants.restaurantId}&customerId=${storage.custId}&inProgress=false`
  );

  return (
    <div className="view-orders">
      <h1 className="title-header">My Orders</h1>
      <div className="view-order-container">
        <h1 className="status-heading">In Progress</h1>
        {inProgressOrders &&
          inProgressOrders.map((order) => (
            <MyOrdersDropdown key={order._id} order={order} />
          ))}
      </div>
      <div className="view-order-container">
        <h1 className="status-heading">Completed</h1>
        {completedOrders &&
          completedOrders.map((order) => (
            <MyOrdersDropdown key={order._id} order={order} />
          ))}
      </div>
    </div>
  );
}
