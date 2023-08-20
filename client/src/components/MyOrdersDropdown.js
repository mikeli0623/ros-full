import { Dropdown } from "react-bootstrap";
import MyOrdersItem from "./MyOrdersItem";

const MyOrdersDropdown = ({ order }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        className="dropdown-toggle"
        title="Click to see detailed Information about your order!"
      >
        {order.totalItems} items, ${order.totalCost.toFixed(2)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <MyOrdersItem items={order.items} total={order.totalCost} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MyOrdersDropdown;
