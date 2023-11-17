import useFetch from "./hooks/useFetch";
import Button from "./Button";
import edit_pencil from "images/image_edit_pencil.png";
import * as constants from "../utils/constants";

const Item = ({ itemId, setEditItem, setEditingItem }) => {
  const { data: item, isLoading } = useFetch(
    constants.API_URL + `/items/${itemId}`
  );

  return (
    <>
      {item && (
        <div className="tw-p-[20px] tw-flex tw-flex-row tw-rounded tw-border-[2px] tw-border-solid tw-border-[#CBD5E1] tw-gap-[15px] tw-mb-[15px]">
          <img className="tw-w-[125px]" src={item.img} alt="" />
          <div className="tw-flex tw-flex-col tw-gap-[3px]">
            <div>
              <span style={{ color: "#B5838D" }}>Name: </span>
              {item.name}
            </div>
            <div>
              <span style={{ color: "#B5838D" }}>Description: </span>
              {item.ingredients.join(", ")}
            </div>
            <div>
              <span style={{ color: "#B5838D" }}>Cost: </span>${item.cost}
            </div>
          </div>
          <div className="tw-ml-auto tw-self-center">
            <Button
              color="blue"
              disabled={!item || isLoading}
              content={
                <img
                  className="tw-w-[48px] tw-h-[48px] tw-brightness-0 tw-invert"
                  src={edit_pencil}
                  alt="edit icon"
                />
              }
              onClick={() => {
                setEditingItem(true);
                setEditItem(item);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Item;
