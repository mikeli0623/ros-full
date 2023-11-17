import * as constants from "utils/constants";
import Navigator from "components/Navigatior";
import { useEffect, useState } from "react";
import Button from "components/Button";
import Modal from "components/Modal";
import delete_trash from "images/image_delete_trash.png";
import Input from "components/Input";
import { Textarea, Spinner } from "@chakra-ui/react";
import Select from "react-select";
import useFetch from "./hooks/useFetch";
import axios from "axios";
import Item from "./Item";

const OwnerPage = () => {
  const [currentPageTab, setCurrentPageTab] = useState(
    constants.OWNER_PAGE_TABS.MENU_ITEMS
  );

  return (
    <div>
      <Navigator
        tabs={constants.OWNER_PAGE_TABS_CONFIGS(setCurrentPageTab)}
        activeTab={currentPageTab}
        activePointerTab={true}
      />
      {currentPageTab === constants.OWNER_PAGE_TABS.MENU_ITEMS ? (
        <OwnerPageMenu />
      ) : null}
      {currentPageTab === constants.OWNER_PAGE_TABS.CONTACT_INFO ? (
        <OwnerPageContact />
      ) : null}
      {currentPageTab === constants.OWNER_PAGE_TABS.ACCOUNT ? (
        <OwnerPageAccount />
      ) : null}
    </div>
  );
};

const OwnerPageMenu = () => {
  const [editingItem, setEditingItem] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [removingCategory, setRemovingCategory] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editItem, setEditItem] = useState(null);

  const {
    data: categories,
    fetchData,
    isLoading,
  } = useFetch(
    constants.API_URL + `/category?restId=${constants.restaurantId}`
  );

  const addCategory = async () => {
    try {
      await axios.post(constants.API_URL + `/category`, {
        name: categoryName,
        restaurantId: constants.restaurantId,
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCategory = async () => {
    try {
      await axios.delete(constants.API_URL + `/category/${categoryId}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (categories && categories.length > 0)
      setOptions(
        categories.map((category) => {
          return { value: category._id, label: category.name };
        })
      );
  }, [categories]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-[20px]">
      {editingItem && (
        <OwnerPageMenuModal
          setEditingItem={setEditingItem}
          editItem={editItem}
          setEditItem={setEditItem}
          refetch={fetchData}
          options={options}
          isEdit
          categories={categories}
        />
      )}
      {addingItem && (
        <OwnerPageMenuModal
          setEditingItem={setAddingItem}
          isEdit={false}
          refetch={fetchData}
          options={options}
          categories={categories}
        />
      )}
      {addingCategory && (
        <Modal
          title={"Add Category"}
          onClose={() => {
            setAddingCategory(false);
            setCategoryName("");
          }}
          onConfirm={() => {
            addCategory();
            setAddingCategory(false);
            setCategoryName("");
          }}
          confirmDisabled={categoryName.length === 0}
          renderBody={() => {
            return (
              <Input
                value={categoryName}
                placeholder="Category name..."
                onChange={(value) => {
                  setCategoryName(value);
                }}
                hasError={categoryName.length === 0}
                errorMessage={"Category field cannot be empty"}
              />
            );
          }}
        />
      )}
      {removingCategory && (
        <Modal
          title={"Remove Category"}
          onClose={() => {
            setRemovingCategory(false);
            setCategoryId("");
            setCategoryName("");
          }}
          onConfirm={() => {
            deleteCategory();
            setRemovingCategory(false);
            setCategoryId("");
            setCategoryName("");
          }}
          renderBody={() => {
            return (
              <div>{`Are you sure you want to remove the category "${categoryName}"?`}</div>
            );
          }}
        />
      )}
      <div className="tw-flex tw-flex-row tw-gap-[20px]">
        <Button
          color="blue"
          content="Add Menu Item"
          onClick={() => {
            setAddingItem(true);
          }}
          className="tw-w-[350px]"
        />
        <Button
          color="blue"
          content="Add Category"
          onClick={() => {
            setAddingCategory(true);
          }}
          className="tw-w-[350px]"
        />
      </div>
      {isLoading ? (
        <Spinner
          size="xl"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <>
          {categories &&
            categories.toReversed().map((category) => {
              return (
                <div className="tw-mb-[20px]" key={category._id}>
                  <div className="tw-flex tw-flex-row tw-gap-[20px] tw-mb-[20px]">
                    <div className="tw-text-2xl tw-underline">
                      {category.name}
                    </div>
                    <Button
                      className="tw-w-[32px] tw-h-[32px]"
                      color="red"
                      content={"X"}
                      onClick={() => {
                        setRemovingCategory(true);
                        setCategoryId(category._id);
                        setCategoryName(category.name);
                      }}
                    />
                  </div>
                  {category.items.length > 0 ? (
                    category.items.map((item) => {
                      return (
                        <Item
                          key={item}
                          itemId={item}
                          setEditingItem={setEditingItem}
                          setEditItem={setEditItem}
                        />
                      );
                    })
                  ) : (
                    <div className="tw-italic">No items added in category</div>
                  )}
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};

const OwnerPageMenuModal = ({
  setEditingItem,
  isEdit,
  categories,
  editItem = undefined,
  options,
  refetch,
  setEditItem = () => {},
}) => {
  const [itemInfo, setItemInfo] = useState(
    isEdit
      ? {
          ...editItem,
          categories: categories
            .filter((category) => {
              return category.items.includes(editItem._id);
            })
            .map((category) => {
              return category._id;
            }),
        }
      : {
          name: "",
          cost: "",
          ingredients: [],
          categories: [],
          img: null,
        }
  );

  const [optionsValue, setOptionsValue] = useState(
    isEdit
      ? options.filter((option) =>
          categories
            .filter((category) => category.items.includes(editItem._id))
            .map((category) => category._id)
            .includes(option.value)
        )
      : []
  );

  const updateCategory = async (catId, items) => {
    try {
      const res = await axios.patch(constants.API_URL + `/category/${catId}`, {
        items: items,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async () => {
    try {
      await axios.delete(constants.API_URL + `/items/${editItem._id}`);
      Promise.all(
        categories
          .filter((category) => category.items.includes(editItem._id))
          .map((category) => {
            const index = category.items.indexOf(editItem._id);
            let itemsClone = [...category.items];
            itemsClone.splice(index, 1);
            return updateCategory(category._id, itemsClone);
          })
      );
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const addItem = async () => {
    try {
      const res = await axios.post(constants.API_URL + "/items", {
        name: itemInfo.name,
        cost: itemInfo.cost,
        ingredients:
          typeof itemInfo.ingredients === "object"
            ? itemInfo.ingredients
            : itemInfo.ingredients
                .split(",")
                .map((ingredient) => ingredient.trim()),
        size: itemInfo.size,
        img: itemInfo.img,
        restaurantId: constants.restaurantId,
      });
      Promise.all(
        categories
          .filter((category) => itemInfo.categories.includes(category._id))
          .map((category) => {
            let items = [...category.items];
            items.push(res.data._id);
            return updateCategory(category._id, items);
          })
      );
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const updateItem = async () => {
    try {
      const res = await axios.patch(
        constants.API_URL + `/items/${itemInfo._id}`,
        {
          name: itemInfo.name,
          cost: itemInfo.cost,
          ingredients:
            typeof itemInfo.ingredients === "object"
              ? itemInfo.ingredients
              : itemInfo.ingredients
                  .split(",")
                  .map((ingredient) => ingredient.trim()),
          size: itemInfo.size,
          img: itemInfo.img,
        }
      );
      Promise.all(
        categories.map((category) => {
          let items = [...category.items];

          if (
            items.includes(res.data._id) &&
            !itemInfo.categories.includes(category._id)
          ) {
            const index = items.indexOf(res.data._id);
            items.splice(index, 1);
          } else if (
            !items.includes(res.data._id) &&
            itemInfo.categories.includes(category._id)
          )
            items.push(res.data._id);
          return updateCategory(category._id, items);
        })
      );
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Menu Item" : "Add Menu Item"}
      onClose={() => {
        setEditingItem(false);
        setEditItem(null);
      }}
      onReset={() => {
        if (isEdit) {
          setOptionsValue(
            options.filter((option) =>
              categories
                .filter((category) => category.items.includes(editItem._id))
                .map((category) => category._id)
                .includes(option.value)
            )
          );
          setItemInfo({
            ...editItem,
            categories: categories
              .filter((category) => {
                return category.items.includes(editItem._id);
              })
              .map((category) => {
                return category.name;
              }),
          });
        } else {
          setOptionsValue([]);
          setItemInfo({
            name: "",
            cost: "",
            ingredients: [],
            categories: [],
            img: null,
          });
        }
      }}
      onConfirm={() => {
        setEditingItem(false);
        if (isEdit) updateItem();
        else addItem();
      }}
      confirmDisabled={
        itemInfo.categories.length === 0 || !itemInfo.name || !itemInfo.cost
      }
      renderBody={() => {
        return (
          <div className="tw-flex tw-flex-row tw-gap-[30px] tw-items-center">
            <div className="tw-flex tw-flex-col tw-gap-[30px] tw-items-center">
              {itemInfo.img ? (
                <img
                  className="tw-w-[150px] tw-h-[125px]"
                  src={itemInfo.img}
                  alt="item"
                />
              ) : null}
              {
                <>
                  <Button
                    color="blue"
                    content={
                      <label htmlFor="owner-page-menu-input-file">
                        Upload Image
                      </label>
                    }
                  />
                  <input
                    type="file"
                    id="owner-page-menu-input-file"
                    onChange={(event) => {}}
                  />
                </>
              }
            </div>
            <div className="tw-flex tw-flex-col tw-gap-[12px]">
              <div className="tw-flex tw-flex-row tw-gap-[20px]">
                <div className="tw-mt-[8px]">Category:</div>
                <div className="tw-flex tw-flex-col tw-gap-[12px]">
                  <Select
                    className="tw-px-[8px] tw-py-[4px] tw-text-ellipsis focus:tw-rounded focus:tw-border-[2px] focus:tw-border-solid focus:tw-border-[#90ddf0] tw-border-[2px] tw-border-transparent focus:tw-outline-none tw-shadow-none tw-bg-transparent tw-border-b-solid tw-border-b-[#CBD5E1] hover:tw-border-b-[#90ddf0] tw-duration-200"
                    placeholder={"Select category"}
                    defaultValue={optionsValue}
                    value={optionsValue}
                    options={options}
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={(categories) => {
                      setOptionsValue(categories);
                      let selectedCategories = categories.map((category) => {
                        return category.value;
                      });
                      setItemInfo({
                        ...itemInfo,
                        categories: selectedCategories,
                      });
                    }}
                  />
                  {itemInfo.categories.length === 0 ? (
                    <div className="tw-text-xs tw-text-[#eb9486]">
                      Category field cannot be emppty
                    </div>
                  ) : null}
                </div>
              </div>
              <Input
                value={itemInfo.name}
                placeholder="Name..."
                onChange={(value) => {
                  setItemInfo({ ...itemInfo, name: value });
                }}
                hasError={!itemInfo.name}
                errorMessage={"Name field cannot be empty"}
              />
              <Input
                value={itemInfo.ingredients.join(", ")}
                placeholder="Ingredients..."
                onChange={(value) => {
                  setItemInfo({ ...itemInfo, ingredients: value });
                }}
              />
              <Input
                type="number"
                value={itemInfo.cost}
                placeholder="Cost..."
                onChange={(value) => {
                  setItemInfo({ ...itemInfo, cost: value });
                }}
                hasError={!itemInfo.cost}
                errorMessage={"Cost field cannot be empty"}
              />
            </div>
            {isEdit && (
              <div className="tw-ml-auto tw-self-center">
                <Button
                  color="red"
                  content={
                    <img
                      className="tw-w-[48px] tw-h-[48px] tw-brightness-0 tw-invert"
                      src={delete_trash}
                      alt="delete icon"
                    />
                  }
                  onClick={() => {
                    deleteItem();
                    setEditingItem(false);
                  }}
                />
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

const OwnerPageContact = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: restData, fetchData } = useFetch(
    constants.API_URL + `/restaurants/${constants.restaurantId}`
  );

  const [restInfo, setRestInfo] = useState({
    about: "",
    location: "",
    email: "",
    phone: "",
  });

  const updateRestInfo = async () => {
    try {
      await axios.patch(
        constants.API_URL + `/restaurants/${constants.restaurantId}`,
        restInfo
      );
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (restData)
      setRestInfo({
        about: restData.about,
        location: restData.location,
        email: restData.email,
        phone: restData.phone,
      });
  }, [restData]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-[10px]">
      {restData && (
        <>
          {!isEditing && (
            <Button
              color="blue"
              content="Edit Restaurant Info"
              onClick={() => {
                setIsEditing(true);
              }}
              className="tw-w-[250px]"
            />
          )}
          <div className="tw-flex tw-flex-col tw-gap-[6px] tw-mb-[30px]">
            {isEditing ? (
              <Textarea
                value={restInfo.about}
                onChange={(e) => {
                  setRestInfo({ ...restInfo, about: e.target.value });
                }}
                hasError={restInfo.about.length === 0}
                errorMessage={"About Us field cannot be empty"}
                className="tw-w-[50%]"
                focusBorderColor="blue.100"
                size="s"
                style={{ width: "50%", height: "30vh", padding: "1%" }}
              />
            ) : (
              <div>
                <p style={{ color: "#B5838D" }}>About Us: </p>
                <p className="tw-w-[45%] mb-[3%]">{restData.about}</p>
              </div>
            )}
            {isEditing ? (
              <Input
                value={restInfo.location}
                onChange={(value) => {
                  setRestInfo({ ...restInfo, location: value });
                }}
                hasError={restInfo.location.length === 0}
                errorMessage={"Location field cannot be empty"}
                className="tw-w-[50%]"
              />
            ) : (
              <div>
                <p style={{ color: "#B5838D" }}>Location:</p>
                <p className="mb-[3%]">{restData.location}</p>
              </div>
            )}
            {isEditing ? (
              <Input
                value={restInfo.email}
                onChange={(value) => {
                  setRestInfo({ ...restInfo, email: value });
                }}
                hasError={restInfo.email.length === 0}
                errorMessage={"Email field cannot be empty"}
                className="tw-w-[50%]"
              />
            ) : (
              <div>
                <p style={{ color: "#B5838D" }}>Email: </p>
                <p className="mb-[3%]">{restData.email}</p>
              </div>
            )}
            {isEditing ? (
              <Input
                value={restInfo.phone}
                onChange={(value) => {
                  setRestInfo({ ...restInfo, phone: value });
                }}
                hasError={restInfo.phone.length === 0}
                errorMessage={"Phone field cannot be empty"}
                className="tw-w-[50%]"
              />
            ) : (
              <div>
                <p style={{ color: "#B5838D" }}>Phone: </p>
                <p className="mb-[3%]">{restData.phone}</p>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="tw-flex tw-flex-row tw-justify-end tw-gap-[20px] tw-p-[12px] tw-border-t-[2px] tw-border-solid tw-border-[#CBD5E1]">
              <Button
                color="blue"
                content={"Reset"}
                onClick={() => {
                  setRestInfo({
                    about: restData.about,
                    location: restData.location,
                    email: restData.email,
                    phone: restData.phone,
                  });
                }}
                className="tw-self-start"
              />
              <Button
                color="red"
                content={"Cancel"}
                onClick={() => {
                  setRestInfo({
                    about: restData.about,
                    location: restData.location,
                    email: restData.email,
                    phone: restData.phone,
                  });
                  setIsEditing(false);
                }}
              />
              <Button
                color="green"
                content={"Confirm"}
                onClick={() => {
                  updateRestInfo();
                  setIsEditing(false);
                }}
                disabled={
                  restInfo.about.length === 0 ||
                  restInfo.location.length === 0 ||
                  restInfo.email === 0 ||
                  restInfo.phone === 0
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const OwnerPageAccount = () => {
  const {
    data: accountData,
    isLoading,
    fetchData,
  } = useFetch(constants.API_URL + `/users?restId=${constants.restaurantId}`);

  const [adminAccount, setAdminAccount] = useState({
    username: "",
    password: "",
    id: "",
  });

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
  });

  const [employeeAccounts, setEmployeeAccounts] = useState([]);

  useEffect(() => {
    const setData = () => {
      let empAccounts = [];
      accountData.forEach((account) => {
        if (account.isAdmin) {
          setAdminAccount({
            username: account.username,
            password: account.password,
            id: account._id,
          });
          setNewAdmin({
            username: account.username,
            password: account.password,
          });
        } else {
          empAccounts.push({
            username: account.username,
            password: account.password,
            id: account._id,
          });
        }
      });
      setEmployeeAccounts(empAccounts);
    };
    // if (accountData) setData();
    console.log(accountData);
  }, [accountData]);

  const [isEditingOwnerAccount, setIsEditingOwnerAccount] = useState(false);
  const [isAddingEmployeeAccount, setIsAddingEmployeeAccount] = useState(false);

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(constants.API_URL + `/users/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const updateAdmin = async () => {
    try {
      axios.put(constants.API_URL + `/users/${adminAccount.id}`, {
        username: newAdmin.username,
        password: newAdmin.password,
      });
      fetchData();
      setAdminAccount({
        username: newAdmin.username,
        password: newAdmin.password,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-[10px]">
      {!isEditingOwnerAccount ? (
        <div className="tw-flex tw-flex-col tw-gap-[20px]">
          <div className="tw-text-2xl tw-underline tw-mb-[10px]">
            Restaurant Owner Account
          </div>
          <Button
            color="blue"
            content="Edit Restaurant Owner Account"
            onClick={() => {
              setIsEditingOwnerAccount(true);
            }}
            className="tw-w-[350px]"
          />
        </div>
      ) : null}
      <div className="tw-flex tw-flex-col tw-gap-[6px] tw-mb-[30px]">
        {isEditingOwnerAccount ? (
          <Input
            value={newAdmin.username}
            onChange={(value) => {
              setNewAdmin({ ...newAdmin, username: value });
            }}
            hasError={!newAdmin.username}
            errorMessage={"Username field cannot be empty"}
            className="tw-w-[50%]"
          />
        ) : (
          <div>
            <span style={{ color: "#B5838D" }}>Username: </span>
            {adminAccount.username}
          </div>
        )}
        {isEditingOwnerAccount ? (
          <Input
            value={newAdmin.password}
            onChange={(value) => {
              setNewAdmin({ ...newAdmin, password: value });
            }}
            hasError={!newAdmin.password}
            errorMessage={"Password field cannot be empty"}
            className="tw-w-[50%] password"
          />
        ) : (
          <div>
            <span style={{ color: "#B5838D" }}>Password: </span>
            {"*".repeat(8)}
          </div>
        )}
      </div>
      {isEditingOwnerAccount ? (
        <div className="tw-flex tw-flex-row tw-justify-end tw-gap-[20px] tw-p-[12px] tw-border-t-[2px] tw-border-solid tw-border-[#CBD5E1]">
          <Button
            color="blue"
            content={"Reset"}
            onClick={() => {
              setNewAdmin({
                username: adminAccount.username,
                password: adminAccount.password,
              });
            }}
            className="tw-self-start"
          />
          <Button
            color="red"
            content={"Cancel"}
            onClick={() => {
              setNewAdmin({
                username: adminAccount.username,
                password: adminAccount.password,
              });
              setIsEditingOwnerAccount(false);
            }}
          />
          <Button
            color="green"
            content={"Confirm"}
            onClick={() => {
              updateAdmin();
              setIsEditingOwnerAccount(false);
            }}
            disabled={!newAdmin.username || !newAdmin.password}
          />
        </div>
      ) : null}
      {!isEditingOwnerAccount ? (
        <div className="tw-flex tw-flex-col tw-gap-[20px]">
          <div className="tw-text-2xl tw-underline tw-mb-[10px]">
            Restaurant Employee Accounts
          </div>
          <Button
            color="blue"
            content="Add Restaurant Employee Account"
            onClick={() => {
              setIsAddingEmployeeAccount(true);
            }}
            className="tw-w-[350px]"
          />
          <>
            {isLoading ? (
              <Spinner />
            ) : (
              employeeAccounts.map((account) => {
                return (
                  <div
                    key={account.id}
                    className="tw-p-[20px] tw-flex tw-flex-row tw-rounded tw-border-[2px] tw-border-solid tw-border-[#CBD5E1] tw-gap-[15px] tw-mb-[15px]"
                  >
                    <div className="tw-flex tw-flex-col tw-gap-[3px]">
                      <div>
                        <span style={{ color: "#B5838D" }}>Username: </span>
                        {account.username}
                      </div>
                      <div>
                        <span style={{ color: "#B5838D" }}>Password: </span>
                        {"*".repeat(8)}
                      </div>
                    </div>
                    <div className="tw-ml-auto tw-self-center">
                      <Button
                        color="red"
                        content={
                          <img
                            className="tw-w-[48px] tw-h-[48px] tw-brightness-0 tw-invert"
                            src={delete_trash}
                            alt="delete trash"
                          />
                        }
                        onClick={() => {
                          deleteEmployee(account.id);
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </>
        </div>
      ) : null}
      {isAddingEmployeeAccount ? (
        <OwnerPageAccountModal
          setIsAddingEmployeeAccount={setIsAddingEmployeeAccount}
          fetchData={fetchData}
        />
      ) : null}
    </div>
  );
};

const OwnerPageAccountModal = (props) => {
  const { setIsAddingEmployeeAccount, fetchData } = props;

  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");

  const addEmployee = async () => {
    try {
      await axios.post(constants.API_URL + `/auth/register`, {
        username: employeeUsername,
        password: employeePassword,
        restaurantId: constants.restaurantId,
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      title="Add Restaurant Employee Account"
      onClose={() => {
        setIsAddingEmployeeAccount(false);
      }}
      onReset={() => {
        setEmployeeUsername("");
        setEmployeePassword("");
      }}
      onConfirm={() => {
        addEmployee();
        setIsAddingEmployeeAccount(false);
      }}
      confirmDisabled={!employeeUsername || !employeePassword}
      renderBody={() => {
        return (
          <div className="tw-flex tw-flex-row tw-gap-[30px] tw-items-center">
            <div className="tw-flex tw-flex-col tw-gap-[12px]">
              <Input
                value={employeeUsername}
                onChange={(value) => {
                  setEmployeeUsername(value);
                }}
                hasError={!employeeUsername}
                errorMessage={"Username field cannot be empty"}
              />
              <Input
                value={employeePassword}
                onChange={(value) => {
                  setEmployeePassword(value);
                }}
                hasError={!employeePassword}
                errorMessage={"Password field cannot be empty"}
                className="password"
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default OwnerPage;
