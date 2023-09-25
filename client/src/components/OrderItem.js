import React, { useState } from "react";
import "../styles/Menu.scss";
import "react-lazy-load-image-component/src/effects/opacity.css";
import Button from "components/Button";
import { Select } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import axios from "axios";
import useFetch from "./hooks/useFetch";
import * as constants from "utils/constants";

export default function OrderItem({ order, refetchOrder }) {
  const { data: custData } = useFetch(
    `https://ros-api.onrender.com/api/customers?restId=${constants.restaurantId}&_id=${order.customerId}`
  );

  const createItemRows = function () {
    return order.items.map((item) => {
      return (
        <Tr key={item._id}>
          <Td style={{ textAlign: "left" }}>{item.name}</Td>
          <Td isNumeric style={{ textAlign: "left" }}>
            {item.amount}
          </Td>
          <Td isNumeric style={{ textAlign: "left" }}>
            ${item.cost}
          </Td>
        </Tr>
      );
    });
  };

  //View Items button stuff
  const [viewItems, setViewItems] = useState(false);
  const viewItemsClose = () => setViewItems(false);
  const viewItemsShow = () => setViewItems(true);
  const onChangeOrderStatus = async (inProgress) => {
    try {
      await axios.patch(`/orders/${order._id}`, {
        inProgress: inProgress,
      });
      refetchOrder();
    } catch (err) {
      console.log(err);
    }
  };

  //Cancel order button stuff
  const [cancelOrder, setCancelOrder] = useState(false);
  const cancelOrderClose = () => setCancelOrder(false);
  const cancelOrderShow = () => setCancelOrder(true);
  const onCancelOrder = async () => {
    try {
      await axios.delete(`/orders/${order._id}`);
      cancelOrderClose();
      refetchOrder();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="menu-item tw-gap-[20px] tw-border-[2px]"
      style={{ borderColor: "#73454E" }}
    >
      <div className="item-desc">
        <TableContainer>
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td>Order: {order._id}</Td>
                <Td>Order Time: {order.createdAt}</Td>
              </Tr>
              <Tr>
                <Td>Customer: {custData && custData[0].name}</Td>
                <Td>Table: #{custData && custData[0].table}</Td>
              </Tr>
              <Tr>
                <Td>Total Cost: ${order.totalCost.toFixed(2)}</Td>
                <Td>Total Items: {order.totalItems}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
      <div className="item-desc tw-w-[100px]">
        Status
        <Select
          className="form_select"
          defaultValue={order.inProgress}
          onChange={(event) => onChangeOrderStatus(event.target.value)}
        >
          <option
            style={{ backgroundColor: "#434560" }}
            key="In Progress"
            value={true}
          >
            In Progress
          </option>
          <option
            style={{ backgroundColor: "#434560" }}
            key="Completed"
            value={false}
          >
            Completed
          </option>
        </Select>
      </div>

      <div className="item-desc tw-flex tw-flex-col tw-gap-[20px]">
        <Button color="blue" content="View Items" onClick={viewItemsShow} />
        <Button
          color="red"
          content="Cancel Order"
          disabled={!order.inProgress}
          onClick={cancelOrderShow}
        />
        <AlertDialog isCentered isOpen={viewItems} onClose={viewItemsClose}>
          <AlertDialogOverlay>
            <AlertDialogContent
              style={{ color: "#FFCDB2", backgroundColor: "#272838" }}
            >
              <AlertDialogHeader
                fontSize="lg"
                fontWeight="bold"
                style={{ color: "#B5838D" }}
              >
                {"Order: ".concat(order._id)}
                <AlertDialogCloseButton />
              </AlertDialogHeader>
              <AlertDialogBody>
                <Table>
                  <Tr>
                    <Td style={{ fontWeight: "bold", fontSize: "18px" }}>
                      Item
                    </Td>
                    <Td style={{ fontWeight: "bold", fontSize: "18px" }}>
                      Amount
                    </Td>
                    <Td style={{ fontWeight: "bold", fontSize: "18px" }}>
                      Price
                    </Td>
                  </Tr>
                  {createItemRows()}
                </Table>
              </AlertDialogBody>
              <AlertDialogFooter>
                <div className="tw-flex tw-flex-row">
                  <p>
                    <span style={{ color: "#B5838D" }}>Status: </span>
                    {order.inProgress ? "In Progress" : "Complete"}
                  </p>
                  <p className="tw-ml-2">
                    <span style={{ color: "#B5838D" }}>Total: </span>$
                    {order.totalCost}
                  </p>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog isCentered isOpen={cancelOrder} onClose={cancelOrderClose}>
          <AlertDialogOverlay>
            <AlertDialogContent
              style={{ color: "#FFCDB2", backgroundColor: "#272838" }}
            >
              <AlertDialogHeader
                fontSize="lg"
                fontWeight="bold"
                style={{ color: "#B5838D" }}
              >
                {"Order: ".concat(order._id)}
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you would like to cancel this order?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  onClick={cancelOrderClose}
                  content="No"
                  color="red"
                  className="tw-mx-3"
                />
                <Button onClick={onCancelOrder} content="Yes" color="green" />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </div>
  );
}
