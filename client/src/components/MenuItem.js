import React, { useEffect, useState } from "react";
import "../styles/Menu.scss";
import CostCounter from "./CostCounter";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { LazyMotion, domAnimation, m } from "framer-motion";
import useFetch from "./hooks/useFetch";

export default function MenuItem({
  itemId,
  setTotalCost,
  totalItems,
  setTotalItems,
  clear,
}) {
  const { data } = useFetch(`https://ros-api.onrender.com/api/items/${itemId}`);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (data) setCount(parseInt(sessionStorage.getItem(data.name)));
  }, [totalItems, data]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="menu-item tw-border-[2px] tw-border-solid"
        style={{ borderColor: `${count > 0 ? "#FFB4A2" : "#73454E"}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {data && (
          <>
            <LazyLoadImage
              src={data.img}
              width={150}
              alt={data.name}
              style={{ alignSelf: "center" }}
              effect="opacity"
            />
            <div className="item-desc">
              <div className="tw-flex tw-justify-center">
                <p style={{ color: "#B5838D" }}>Name:</p>
                <p>&nbsp;{data.name}</p>
              </div>
              {data.ingredients.length > 0 && (
                <div className="tw-flex tw-justify-center">
                  <p style={{ color: "#B5838D" }}>Ingredients:&nbsp;</p>
                  <p>{data.ingredients.join(", ")}</p>
                </div>
              )}
              {data.size && (
                <div className="tw-flex tw-justify-center">
                  <p style={{ color: "#B5838D" }}>Size:&nbsp;</p>
                  <p>{data.size}</p>
                </div>
              )}
            </div>
            <CostCounter
              name={data.name}
              cost={data.cost}
              setTotalCost={setTotalCost}
              setTotalItems={setTotalItems}
              clear={clear}
            />
          </>
        )}
      </m.div>
    </LazyMotion>
  );
}
