import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import _ from "lodash";
import {} from "antd";
import { useMergeState } from "../../../../Helpers/customHooks";
import "./_filter-block.scss";
import InputCT from "../../../Inputs/InputCT";
import starIc from "../../../../Images/Pages/Home/star.svg";
import starInactiveIc from "../../../../Images/Pages/Home/star-inactive.svg";
import SelectCT from "../../../Inputs/SelectCT";

const FilterBlock = (props) => {
  const [state, setState] = useMergeState({
    searchName: "",
    stars: 0,
    kind: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });
  const { className } = props;
  const { searchName, stars, kind, minPrice, maxPrice } = state;
  const onChange = (key, value) => {
    setState({ [key]: value });
  };
  const onChangeStar = (stars = 0) => {
    setState({ stars });
  };
  return (
    <div className={classnames("filter-block", className)}>
      <div className="flex">
        <div className="filter-block-title">Search:</div>
        <InputCT name="searchName" value={searchName} onChange={onChange} />
        <div className="filter-block-star">Stars:</div>
        {_.map(_.range(stars), (x, i) => (
          <button
            className="bas-btn"
            key={x}
            onClick={() => onChangeStar(i + 1)}
          >
            <img src={starIc} alt="Star ic" />
          </button>
        ))}
        {_.map(_.range(5 - stars), (x, i) => (
          <button
            className="bas-btn"
            key={x}
            onClick={() => onChangeStar(stars + i + 1)}
          >
            <img src={starInactiveIc} alt="Star inactive ic" />
          </button>
        ))}
      </div>
      <div className="filter-block-row">
        <SelectCT
          name="kind"
          value={kind}
          onChange={onChange}
          className="w-160"
          title="Kind of food:"
        />
        <SelectCT
          name="minPrice"
          value={minPrice}
          onChange={onChange}
          title="Min price:"
          className="ml-48 w-160"
          type="NUMBER"
        />
        <SelectCT
          name="maxPrice"
          value={maxPrice}
          onChange={onChange}
          title="Max price:"
          className="ml-48 w-160"
          type="NUMBER"
        />
      </div>
    </div>
  );
};
FilterBlock.defaultProps = {
  className: "",
};
FilterBlock.propTypes = {
  className: PropTypes.string,
};

export default FilterBlock;
