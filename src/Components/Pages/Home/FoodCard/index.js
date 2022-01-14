import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import _ from "lodash";
import {} from "antd";
import starIc from "../../../../Images/Pages/Home/star.svg";
import starInactiveIc from "../../../../Images/Pages/Home/star-inactive.svg";
import { getPrice } from "../../../../Helpers";
import SelectCT from "../../../Inputs/SelectCT";
import CheckboxCT from "../../../Inputs/CheckboxCT";
import {
  useMergeState,
  useUpdateEffect,
} from "../../../../Helpers/customHooks";
import {
  PACKAGE_DATA,
  QUANTITY_TYPES,
  WEIGHT_DATA,
} from "../../../../Constants/home";
import "./_food-card.scss";

const FoodCard = (props) => {
  const [state, setState] = useMergeState({
    name: props.name,
    price: props.price,
    rating: props.rating,
    isBuy: props.isBuy,
    quantity:
      props.quantity || props.quantityType === QUANTITY_TYPES.WEIGHT
        ? WEIGHT_DATA[0]
        : PACKAGE_DATA[0],
    quantityType: props.quantityType,
  });
  const { className, quantityType, imgSrc, unit, onChangeCart } = props;
  const { name, price, rating, isBuy, quantity } = state;

  useUpdateEffect(() => {
    onChangeCart(state);
  }, [isBuy, quantity]);

  useUpdateEffect(() => {
    setState({ isBuy: props.isBuy });
  }, [props.isBuy]);

  const onChange = (key, value) => {
    setState({ [key]: value });
  };

  // console.log({ title });
  if (!props.title || props.title === "null") {
    console.log({ rating });
  }
  return (
    <div
      className={classnames(
        "food-card",
        isBuy && "food-card-active",
        className
      )}
    >
      {imgSrc ? (
        <img src={imgSrc} alt="Food card img" className="food-card-img" />
      ) : (
        <div className="food-card-img" />
      )}

      <div className="food-card-info">
        <div className="food-card-info-name">{name}</div>

        <div className="fr-sb">
          <div className="food-card-info-col">
            <div className="food-card-info-col-price">
              {getPrice(price, unit)}
            </div>
            <SelectCT
              disabled={!isBuy}
              name="quantity"
              showSearch={false}
              className="mt-4"
              value={quantity}
              onChange={onChange}
              data={
                quantityType === QUANTITY_TYPES.WEIGHT
                  ? WEIGHT_DATA
                  : PACKAGE_DATA
              }
            />
          </div>

          <div className="food-card-info-col">
            <div className="food-card-info-col-rating">
              {_.map(_.range(rating), (x) => (
                <img src={starIc} alt="Star ic" key={x} className="mr-2" />
              ))}
              {_.map(_.range(5 - rating), (x, i) => (
                <img
                  src={starInactiveIc}
                  alt="Star ic"
                  key={x}
                  className={4 - rating !== x ? "mr-2" : ""}
                />
              ))}
            </div>

            <CheckboxCT
              name="isBuy"
              data="Buy"
              isCheck={isBuy}
              onChange={onChange}
              className="mt-4"
            />
          </div>
        </div>
      </div>

      {isBuy && <div className="food-card-isbuy">Buy</div>}
    </div>
  );
};
FoodCard.defaultProps = {
  className: "",
  name: "",
  price: 0,
  rating: 3,
  isBuy: false,
  quantity: undefined,
  quantityType: QUANTITY_TYPES.WEIGHT,
  imgSrc: "",
  unit: "VND",
  onChangeCart: () => {},
};
FoodCard.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  rating: PropTypes.number,
  isBuy: PropTypes.bool,
  quantity: PropTypes.string,
  quantityType: PropTypes.string,
  imgSrc: PropTypes.string,
  unit: PropTypes.string,
  onChangeCart: PropTypes.func,
};

export default FoodCard;
