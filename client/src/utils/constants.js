import { flags } from "./storage";

export const restaurantId = "647e7e9033cbce8e4d5aa774";

export const EMPTY_FUNCTION = () => {};
export const EMPTY_STRING = "";

export const PAGE_TABS = {
  MENU: 0,
  CART: 1,
  MY_ORDERS: 2,
  EMPLOYEE_VIEW: 3,
  OWNER_VIEW: 4,
  START_SCREEN: 5,
};

export const PAGE_TABS_CONFIG = (setCurrentPageTab) => {
  return [
    {
      text: "Menu",
      onClick: () => {
        setCurrentPageTab(PAGE_TABS.MENU);
      },
      getIsDisabled: () => {
        return !flags.isCustomerSignedIn;
      },
    },
    {
      text: "Cart",
      onClick: () => {
        setCurrentPageTab(PAGE_TABS.CART);
      },
      getIsDisabled: () => {
        return !flags.isCustomerSignedIn;
      },
    },
    {
      text: "My Orders",
      onClick: () => {
        setCurrentPageTab(PAGE_TABS.MY_ORDERS);
      },
      getIsDisabled: () => {
        return !flags.isCustomerSignedIn;
      },
    },
  ];
};

export const OWNER_PAGE_TABS = {
  MENU_ITEMS: 0,
  CONTACT_INFO: 1,
  ACCOUNT: 2,
};

export const OWNER_PAGE_TABS_CONFIGS = (setCurrentPageTab) => {
  return [
    {
      text: "Menu Items",
      onClick: () => {
        setCurrentPageTab(OWNER_PAGE_TABS.MENU_ITEMS);
      },
      getIsDisabled: () => {
        return false;
      },
    },
    {
      text: "Restaurant Info",
      onClick: () => {
        setCurrentPageTab(OWNER_PAGE_TABS.CONTACT_INFO);
      },
      getIsDisabled: () => {
        return false;
      },
    },
    {
      text: "Account",
      onClick: () => {
        setCurrentPageTab(OWNER_PAGE_TABS.ACCOUNT);
      },
      getIsDisabled: () => {
        return false;
      },
    },
  ];
};

export const API_URL = "https://ros-api.onrender.com";
