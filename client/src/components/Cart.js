import React, { useState, useEffect } from "react";
import { storage } from "utils/storage";
import "../styles/Cart.scss";
import * as constants from "../utils/constants";
import emptyCart from "images/emptyCart.png";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  List,
  ListItem,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  extendTheme,
  useToast,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import axios from "axios";
import CartItem from "./CartItem";
import Button from "./Button";

export default function Cart({ data, setCurrentPageTab }) {
  const toast = useToast();
  const [totalCost, setTotalCost] = useState(
    parseFloat(sessionStorage.getItem("totalCost")) || 0
  );
  const [totalItems, setTotalItems] = useState(
    parseInt(sessionStorage.getItem("totalItems")) || 0
  );
  const [isOpen, setOpen] = useState(false);
  const [paymentOptionSelected, setPaymentOption] = useState("");
  const [paymentAlert, showPaymentAlert] = useState("none");
  const [cartItems, setCartItems] = useState(
    Object.keys(sessionStorage).filter(
      (item) =>
        item !== "totalCost" &&
        item !== "totalItems" &&
        sessionStorage.getItem(item) > 0
    )
  );

  useEffect(() => {
    sessionStorage.setItem("totalCost", totalCost);
    setCartItems(
      Object.keys(sessionStorage).filter(
        (item) =>
          item !== "totalCost" &&
          item !== "totalItems" &&
          sessionStorage.getItem(item) > 0
      )
    );
  }, [totalCost]);

  useEffect(() => {
    sessionStorage.setItem("totalItems", totalItems);
  }, [totalItems]);

  const onChangePaymentOption = (event) => {
    setPaymentOption(event.target.value);
  };

  const submitOrder = () => {
    if (paymentOptionSelected === "") {
      showPaymentAlert("");
    } else if (paymentOptionSelected === "Inperson") {
      reset();
    } else {
      showPaymentAlert("none");
      setOpen(true);

      setCardholderNameError("");
      setCardCVCError("");
      setCardExpiryError("");
      setCardNumberError("");

      setCardholderName("");
      setCardNumber("");
      setCardCVC("");
      setCardExpiryMonth("");
      setCardExpiryYear("");
    }
  };

  const cancel = () => {
    setOpen(false);
  };

  const theme = extendTheme({
    components: {
      Modal: {
        baseStyle: (props) => ({
          dialog: {
            bg: "#282935",
          },
        }),
      },
    },
  });

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: `#6D6875`,
    };
    return (
      <div className="bar" style={{ ...style, ...thumbStyle }} {...props} />
    );
  };

  const renderThumbHorizontal = ({ style, ...props }) => {
    const thumbStyle = {
      display: "none",
    };
    return (
      <div className="bar" style={{ ...style, ...thumbStyle }} {...props} />
    );
  };

  const removeItem = (name, quantity, cost) => {
    sessionStorage.setItem(name, 0);
    setTotalCost(
      (prevTotal) => Math.round((prevTotal - quantity * cost) * 100) / 100
    );
    setTotalItems((prevTotal) => prevTotal - quantity);
    toast({
      title: `${name} removed`,
      status: "info",
      isClosable: true,
    });
  };

  const fetchItemInfo = async (name) => {
    try {
      const res = await fetch(
        `https://ros-api.onrender.com/api/items/byName/${encodeURI(name)}`
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const reset = async () => {
    let items = [];
    try {
      const itemInfo = await Promise.all(
        cartItems.map((item) => {
          return fetchItemInfo(item);
        })
      );
      cartItems.forEach((item, i) => {
        items.push({
          name: item,
          cost: itemInfo[i].cost,
          amount: sessionStorage.getItem(item),
        });
      });
      try {
        await axios.post("/orders", {
          restaurantId: constants.restaurantId,
          customerId: storage.custId,
          totalCost: sessionStorage.getItem("totalCost"),
          totalItems: sessionStorage.getItem("totalItems"),
          items: items,
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }

    sessionStorage.clear();
    toast({
      title: `Order Submitted`,
      description: "Submit another order or view orders in 'My Orders'",
      status: "success",
      isClosable: true,
    });
    setCurrentPageTab(constants.PAGE_TABS.MENU);
  };

  const [cardholderNameError, setCardholderNameError] = useState("");
  const [cardExpiryError, setCardExpiryError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardCVCError, setCardCVCError] = useState("");

  const [cardholderName, setCardholderName] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("");
  const [cardExpiryYear, setCardExpiryYear] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const validatePaymentInfo = () => {
    var isValidated = true;

    if (cardholderName === "") {
      setCardholderNameError("Cardholder Name is required");
      isValidated = false;
    } else {
      setCardholderNameError("");
    }
    if (cardExpiryMonth === "" || cardExpiryYear === "") {
      setCardExpiryError("Expiry is required");
      isValidated = false;
    } else if (
      parseInt(cardExpiryMonth) > 12 ||
      parseInt(cardExpiryMonth) < 1
    ) {
      setCardExpiryError("Expiry month is invalid");
      isValidated = false;
    } else if (cardExpiryYear < 22) {
      setCardExpiryError("Expiry year is invalid");
      isValidated = false;
    } else {
      setCardExpiryError("");
    }

    if (cardNumber === "") {
      setCardNumberError("Card Number is required");
      isValidated = false;
    } else if (cardNumber.length < 10) {
      setCardNumberError("Card Number should be 16 digits");
      isValidated = false;
    } else {
      setCardNumberError("");
    }

    if (cardCVC === "") {
      setCardCVCError("Card CVC is required");
      isValidated = false;
    } else if (cardCVC.length < 3 || cardCVC.length > 4) {
      setCardCVCError("Card CVC should be 3 to 4 digits");
      isValidated = false;
    } else {
      setCardCVCError("");
    }

    if (isValidated) {
      reset();
      cancel();
    }
  };

  return (
    <div className={`basket`}>
      <Scrollbars
        renderThumbVertical={renderThumb}
        renderThumbHorizontal={renderThumbHorizontal}
        autoHeight
        autoHeightMin={100}
        autoHeightMax="45vh"
      >
        {cartItems.map((item) => (
          <CartItem
            key={item}
            info={data.getItemInfo(item)}
            setTotalCost={setTotalCost}
            setTotalItems={setTotalItems}
            removeItem={removeItem}
          />
        ))}
        {cartItems.length === 0 && (
          <div>
            <img className="cartEmpty" src={emptyCart} alt="cart empty" />
          </div>
        )}
      </Scrollbars>
      {cartItems.length !== 0 && (
        <div className="basketFooter">
          <div className="orderSummary">
            <List spacing={3}>
              <ListItem>
                <div className="orderSummaryRow">
                  <div
                    className="orderSummaryTitle"
                    style={{ color: "#B5838D" }}
                  >
                    Total:
                  </div>
                  <div className="orderSummaryValue">
                    ${totalCost.toFixed(2)}
                  </div>
                </div>
              </ListItem>
            </List>
            <div className="footerOptions">
              <div className="paymentOptions">
                <Select onChange={onChangePaymentOption}>
                  <option style={{ backgroundColor: "#434560" }} value="">
                    Payment Option
                  </option>
                  <option style={{ backgroundColor: "#434560" }} value="Debit">
                    Debit
                  </option>
                  <option style={{ backgroundColor: "#434560" }} value="Credit">
                    Credit
                  </option>
                  <option
                    style={{ backgroundColor: "#434560" }}
                    value="Inperson"
                  >
                    In person
                  </option>
                </Select>
              </div>
              <Button
                content="Submit"
                onClick={() => {
                  submitOrder();
                }}
              />
            </div>

            <div style={{ display: paymentAlert }} className="paymentAlert">
              Please select payment option
            </div>
          </div>
        </div>
      )}

      <Modal
        theme={theme}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={cancel}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ color: "#B5838D" }}>
            {["Debit", "Credit"].includes(paymentOptionSelected) && (
              <div>Enter payment information</div>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {["Debit", "Credit"].includes(paymentOptionSelected) && (
              <div className="modalBody">
                <div className="cardDetailsRow">
                  <FormControl isRequired>
                    <FormLabel>Cardholder Name</FormLabel>
                    <Input
                      placeholder="Cardholder Name"
                      onChange={(e) => setCardholderName(e.target.value)}
                    />
                    <p className="paymentVerificationError">
                      {cardholderNameError}
                    </p>
                  </FormControl>
                  <FormControl style={{ paddingLeft: "10px" }} isRequired>
                    <FormLabel>Expiry</FormLabel>
                    <div style={{ display: "flex" }}>
                      <div style={{ paddingRight: "10px" }}>
                        <NumberInput>
                          <NumberInputField
                            placeholder="MM"
                            onChange={(e) => {
                              e.target.value =
                                e.target.value.length > 2
                                  ? e.target.value.substring(0, 2)
                                  : e.target.value;
                              setCardExpiryMonth(e.target.value);
                            }}
                          />
                        </NumberInput>
                      </div>
                      <div>
                        <NumberInput>
                          <NumberInputField
                            placeholder="YY"
                            onChange={(e) => {
                              e.target.value =
                                e.target.value.length > 2
                                  ? e.target.value.substring(0, 2)
                                  : e.target.value;
                              setCardExpiryYear(e.target.value);
                            }}
                          />
                        </NumberInput>
                      </div>
                    </div>
                    <p className="paymentVerificationError">
                      {cardExpiryError}
                    </p>
                  </FormControl>
                </div>
                <div className="cardDetailsRow">
                  <FormControl isRequired>
                    <FormLabel>Card Number</FormLabel>
                    <NumberInput>
                      <NumberInputField
                        placeholder="Card Number"
                        onChange={(e) => {
                          e.target.value =
                            e.target.value.length > 16
                              ? e.target.value.substring(0, 16)
                              : e.target.value;
                          setCardNumber(e.target.value);
                        }}
                      />
                    </NumberInput>
                    <p className="paymentVerificationError">
                      {cardNumberError}
                    </p>
                  </FormControl>
                  <FormControl style={{ paddingLeft: "10px" }} isRequired>
                    <FormLabel>CVC</FormLabel>
                    <div>
                      <NumberInput>
                        <NumberInputField
                          placeholder="CVC"
                          onChange={(e) => {
                            e.target.value =
                              e.target.value.length > 4
                                ? e.target.value.substring(0, 4)
                                : e.target.value;
                            setCardCVC(e.target.value);
                          }}
                        />
                      </NumberInput>
                      <p className="paymentVerificationError">{cardCVCError}</p>
                    </div>
                  </FormControl>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {["Debit", "Credit"].includes(paymentOptionSelected) && (
              <Button
                className="tw-mr-3"
                color="green"
                content="Complete Order"
                onClick={() => {
                  validatePaymentInfo();
                }}
              />
            )}
            <Button color="red" onClick={cancel} content={<p>Cancel</p>} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
