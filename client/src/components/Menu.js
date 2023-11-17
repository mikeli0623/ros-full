import React, { useState, useEffect, useRef } from "react";
import "../styles/Menu.scss";
import MenuItem from "./MenuItem";
import * as constants from "../utils/constants";
import { Scrollbars } from "react-custom-scrollbars-2";
import Button from "components/Button";
import Navigator from "./Navigatior";
import {
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import useFetch from "./hooks/useFetch";

export default function Menu({ setCurrentPageTab }) {
  const [currentCategoryTab, setCurrentCategoryTab] = useState(0);
  const [totalCost, setTotalCost] = useState(
    parseFloat(sessionStorage.getItem("totalCost")) || 0
  );
  const [clear, setClear] = useState(false);

  const [totalItems, setTotalItems] = useState(
    parseInt(sessionStorage.getItem("totalItems")) || 0
  );

  useEffect(() => {
    sessionStorage.setItem("totalCost", totalCost.toFixed(2));
  }, [totalCost]);

  useEffect(() => {
    sessionStorage.setItem("totalItems", totalItems);
  }, [totalItems]);

  const { data: categories } = useFetch(
    constants.API_URL + `/category?restId=${constants.restaurantId}`
  );

  useEffect(() => {
    if (clear) {
      sessionStorage.clear();
      setTotalCost(0);
      setTotalItems(0);
      setClear(false);
    }
  }, [clear]);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: `#6D6875`,
    };
    return (
      <div className="bar" style={{ ...style, ...thumbStyle }} {...props} />
    );
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <div id="menu-container">
      <Navigator
        tabs={categories?.map((category, i) => {
          return {
            text: category.name,
            onClick: () => {
              setCurrentCategoryTab(i);
            },
          };
        })}
        activeTab={currentCategoryTab}
        activePointerTab={true}
      />
      <Scrollbars id="menu-item-container" renderThumbVertical={renderThumb}>
        {categories &&
          categories[currentCategoryTab].items.map((itemId) => (
            <MenuItem
              key={itemId}
              itemId={itemId}
              setTotalCost={setTotalCost}
              totalItems={totalItems}
              setTotalItems={setTotalItems}
              clear={clear}
            />
          ))}
      </Scrollbars>
      <div className="menu-footer tw-flex tw-justify-around">
        {/* <InputGroup style={{ width: "20%" }}>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            type="search"
            placeholder="Search for item..."
          />
        </InputGroup> */}
        <div className="tw-flex tw-flex-row tw-content-center">
          <Tooltip
            label="No items in cart!"
            hasArrow
            isDisabled={totalItems > 0}
            openDelay={800}
          >
            <span>
              <Button
                color="red"
                content="Clear Selections"
                disabled={totalItems === 0}
                onClick={onOpen}
              />
            </span>
          </Tooltip>
          <div className="tw-w-[175px] tw-mx-2">
            <p align="left">
              <span style={{ color: "#B5838D" }}>Total Items:</span>{" "}
              {totalItems}
            </p>
            <p align="left">
              <span style={{ color: "#B5838D" }}>Total Cost:</span>
              &nbsp;&nbsp;&nbsp;${Math.abs(totalCost).toFixed(2)}
            </p>
          </div>
        </div>
        <AlertDialog
          isCentered
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
              style={{ color: "#FFCDB2", backgroundColor: "#272838" }}
            >
              <AlertDialogHeader
                fontSize="lg"
                fontWeight="bold"
                style={{ color: "#B5838D" }}
              >
                Clear {totalItems} Items?
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? You can not undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  onClick={onClose}
                  content="Cancel"
                  color="green"
                  className="tw-mx-3"
                />
                <Button
                  onClick={() => {
                    onClose();
                    setClear(true);
                  }}
                  content="Clear"
                  color="red"
                />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Tooltip
          label="No items in cart!"
          hasArrow
          isDisabled={totalItems > 0}
          openDelay={800}
        >
          <span>
            <Button
              color="green"
              content={
                <div className="tw-flex tw-items-center">
                  <p className="tw-m-0">Go to Cart&nbsp;&nbsp;</p>
                  <FontAwesomeIcon icon={faCartShopping} />
                </div>
              }
              onClick={() => setCurrentPageTab(constants.PAGE_TABS.CART)}
              disabled={totalItems === 0}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
