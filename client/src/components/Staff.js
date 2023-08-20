import React, { useState } from "react";
import "../styles/Menu.scss";
import OrderItem from "./OrderItem";
import { Scrollbars } from "react-custom-scrollbars-2";
import Navigator from "./Navigatior";
import emptyOrder from "images/emptyOrder.png";
import useFetch from "./hooks/useFetch";
import * as constants from "../utils/constants";

export default function Staff({ data }) {
  const [inProgress, setInProgress] = useState(true);

  const { data: orders, fetchData } = useFetch(
    `/orders?restId=${constants.restaurantId}&inProgress=${inProgress}`
  );

  const [activeCategory, setActiveCategory] = useState("In Progress");

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: `grey`,
    };
    return (
      <div className="bar" style={{ ...style, ...thumbStyle }} {...props} />
    );
  };

  return (
    <div id="menu-container">
      <Navigator
        tabs={["In Progress", "Completed"].map((category) => {
          return {
            text: category,
            onClick: () => {
              setInProgress(!inProgress);
              setActiveCategory(category);
            },
          };
        })}
        activeTab={activeCategory}
        activePointerTab={true}
        useTextAsId={true}
      />
      {orders && orders?.length === 0 ? (
        <div>
          <div>
            <img className="orderEmpty" src={emptyOrder} alt="Order empty" />
          </div>
          <h1 style={{ fontSize: "2em" }}>Waiting for Orders...</h1>
        </div>
      ) : (
        <Scrollbars id="menu-item-container" renderThumbVertical={renderThumb}>
          {orders?.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              refetchOrder={() =>
                fetchData(
                  `http://localhost:8080/api/orders?restId=${constants.restaurantId}&inProgress=${inProgress}`
                )
              }
            />
          ))}
        </Scrollbars>
      )}
    </div>
  );
}
