import { useState } from "react";
import Header from "./components/Header";
import Navigator from "./components/Navigatior";
import * as constants from "./utils/constants";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Staff from "./components/Staff";
import MyOrders from "./components/MyOrders";
import AboutUs from "./components/AboutUs";
import StaffLogin from "./components/StaffLogin";
import StartScreen from "./components/StartScreen";
import OwnerPage from "components/OwnerPage";
import { ChakraProvider } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const App = () => {
  const [currentPageTab, setCurrentPageTab] = useState(
    constants.PAGE_TABS.START_SCREEN
  );

  return (
    <ChakraProvider>
      <div className="ros tw-px-[40px] tw-py-[30px]">
        <Header setCurrentPageTab={setCurrentPageTab} />
        {currentPageTab !== constants.PAGE_TABS.START_SCREEN &&
          currentPageTab !== constants.PAGE_TABS.EMPLOYEE_VIEW &&
          currentPageTab !== constants.PAGE_TABS.OWNER_VIEW && (
            <Navigator
              tabs={constants.PAGE_TABS_CONFIG(setCurrentPageTab)}
              activeTab={currentPageTab}
              activeNextTab={true}
            />
          )}
        {currentPageTab === constants.PAGE_TABS.START_SCREEN && (
          <Tabs
            size="lg"
            align="center"
            variant="soft-rounded"
            colorScheme="red"
          >
            <TabList>
              <Tab>Customer</Tab>
              <Tab>Staff</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <StartScreen setCurrentPageTab={setCurrentPageTab} />
              </TabPanel>
              <TabPanel>
                <StaffLogin setCurrentPageTab={setCurrentPageTab} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
        {currentPageTab === constants.PAGE_TABS.MENU && (
          <Menu setCurrentPageTab={setCurrentPageTab} />
        )}
        {currentPageTab === constants.PAGE_TABS.CART && (
          <Cart setCurrentPageTab={setCurrentPageTab} />
        )}
        {currentPageTab === constants.PAGE_TABS.MY_ORDERS && <MyOrders />}
        {currentPageTab === constants.PAGE_TABS.ABOUT_US && <AboutUs />}
        {currentPageTab === constants.PAGE_TABS.EMPLOYEE_VIEW && <Staff />}
        {currentPageTab === constants.PAGE_TABS.OWNER_VIEW && <OwnerPage />}
      </div>
    </ChakraProvider>
  );
};

export default App;
