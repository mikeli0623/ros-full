import React, { useEffect, useState } from "react";
import "../styles/Menu.scss";
import Button from "./Button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { LazyMotion, domAnimation, m } from "framer-motion";
import delete_trash from "images/image_delete_trash.png";
import CostCounter from "./CostCounter";

export default function CartItem({
  info,
  setTotalCost,
  setTotalItems,
  removeItem,
}) {
  const [data, setData] = useState(null);

  const [quantity, setQuantity] = useState(null);

  useEffect(() => {
    if (data) sessionStorage.setItem(data.name, quantity);
  }, [quantity, data]);

  useEffect(() => {
    const wait = async () => {
      const res = await info;
      setData(res);
      setQuantity(parseFloat(sessionStorage.getItem(res.name)));
    };
    wait();
  }, [info]);

  return (
    <LazyMotion features={domAnimation}>
      {data && (
        <m.div
          className="cartItem"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="tw-self-center">
            <Button
              color="red"
              content={
                <img
                  className="tw-w-[14px] tw-h-[14px] tw-brightness-0 tw-invert"
                  src={delete_trash}
                  alt="delete item"
                />
              }
              onClick={() => removeItem(data.name, quantity, data.cost)}
              className="tw-mr-[30px]"
            />
          </div>
          <LazyLoadImage
            src={data.img}
            width={125}
            alt={data.name}
            style={{ alignSelf: "center", marginRight: "30px" }}
            placeholderSrc={data.low}
            effect="opacity"
          />
          <div className="cartItemDesc" style={{ userSelect: "none" }}>
            <div>
              <span style={{ color: "#B5838D" }}>Name: </span>
              {data.name}
            </div>
            {data.size ? (
              <div>
                <span style={{ color: "#B5838D" }}>Size: </span>
                {data.size}
              </div>
            ) : null}
          </div>
          <CostCounter
            name={data.name}
            cost={data.cost}
            setQuantity={setQuantity}
            setTotalCost={setTotalCost}
            setTotalItems={setTotalItems}
            removeItem={removeItem}
            clear={false}
            showToast={true}
          />
          <div className="basketLeft tw-ml-auto tw-mr-[50px]">
            <div>${(data.cost * quantity).toFixed(2)}</div>
          </div>
        </m.div>
      )}
    </LazyMotion>
  );
}
