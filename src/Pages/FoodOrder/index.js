import { Button } from "antd";
import classnames from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import InputCT from "../../Components/Inputs/InputCT";
import AnyCustomerModal from "../../Components/Modals/AnyCustomerModal";
import { calcCartTotal } from "../../Components/Pages/Home/HomeBody/helper";
import HomeHeader from "../../Components/Pages/Home/HomeHeader";
import AntdTable from "../../Components/Tables/AntdTable";
import Loading from "../../Components/UI/Loading";
import { getPrice } from "../../Helpers";
import auth from "../../Helpers/auth";
import { useMergeState } from "../../Helpers/customHooks";
import {
  createOrderForAnyCustomer,
  getFoodData,
  mutationCreateOrder,
} from "./helper";
import "./_food-order.scss";

const FoodOrder = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useMergeState({
    foodData: getFoodData(location.state),
    anyCustomerVisible: false,
    notes: "",
    destination: "",
    loading: false,
  });
  const { className } = props;

  const { foodData, anyCustomerVisible, notes, destination, loading } = state;

  // useEffect(() => {
  //   if (!auth.isSuccess()) {
  //     console.log({ login: props.login, auth: auth.isSuccess() });
  //     history.push("/acestore");
  //     setState({});
  //   }
  // }, [props.login]);

  const { total } = calcCartTotal(location.state);
  const { address, phone, email } = auth.getDataLogin();

  const onChange = (key, value) => {
    setState({ [key]: value });
  };

  const generateColumns = () => {
    const columns = [
      {
        title: "No.",
        dataIndex: "index",
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Price",
        dataIndex: "price",
        render: (cell) => getPrice(cell, undefined, ""),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
      },
    ];
    return columns;
  };

  const orderAnyCustomer = async (anyCustomerData = {}) => {
    setState({ loading: true });
    const res = await createOrderForAnyCustomer(foodData, anyCustomerData);
    const obj = { loading: false };
    if (res.isSuccess) {
      alert("Successfully creating order!");
      auth.setFoodData(undefined);
      _.assign(obj, { anyCustomerVisible: false });
      setTimeout(() => {
        history.push("/acestore");
      }, 300);
    } else {
      alert("Failed to create order: ", res.message);
    }
    setState(obj);
  };

  const onClickBack = () => {
    history.push("/acestore");
  };

  const onClickCancel = () => {
    setState({ anyCustomerVisible: !anyCustomerVisible });
  };

  const onClickConfirm = async () => {
    if (!address || !phone || !email) {
      setState({ anyCustomerVisible: true });
      return;
    }
    setState({ loading: true });
    const res = await mutationCreateOrder(foodData, email, notes, destination);
    if (res.isSuccess) {
      alert("Successfully creating order!");
      auth.setFoodData(undefined);
      history.push("/acestore");
    } else {
      alert("Failed to create order: ", res.message);
    }
    setState({ loading: false });
  };

  return (
    <div className={classnames("food-order", className)}>
      <HomeHeader></HomeHeader>
      <div className="food-order-body">
        <div className="food-order-body-toper">
          <div className="flex">
            <span className="b">Payment Options:</span>
            <span className="ml-4">Cash - When receiving</span>
          </div>
          <div className="flex">
            <span className="b">Total:</span>
            <span className="ml-4">{getPrice(total, undefined, "")}</span>
          </div>
        </div>
        <div className="food-order-body-toper">
          <div className="flex">
            <span className="b">Delivery:</span>
            <span className="ml-4">{address}</span>
          </div>
          <div className="flex">
            <span className="b">Contact at:</span>
            <span className="ml-4">{phone}</span>
          </div>
        </div>
        {email && (
          <>
            <InputCT
              titleClassName="b"
              title="Destination"
              name="destination"
              value={destination}
              onChange={onChange}
              placeholder="Enter your notes"
              className="mt-16"
            />
            <InputCT
              titleClassName="b"
              title="Notes"
              name="notes"
              value={notes}
              onChange={onChange}
              placeholder="Enter your notes"
              className="mt-16"
              type="TEXTAREA"
            />
          </>
        )}
        <div className="food-order-body-btns">
          <Button onClick={onClickBack}>Back</Button>
          <Button type="primary" onClick={onClickConfirm}>
            Confirm
          </Button>
        </div>
        <AntdTable
          className="mt-48"
          rowKey="id"
          totalData={foodData}
          columns={generateColumns()}
        ></AntdTable>
      </div>

      <AnyCustomerModal
        visible={anyCustomerVisible}
        onClickCancel={onClickCancel}
        onClick={orderAnyCustomer}
      ></AnyCustomerModal>
      {loading && <Loading></Loading>}
    </div>
  );
};
FoodOrder.defaultProps = {
  className: "",
};
FoodOrder.propTypes = {
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({
  login: state.login,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FoodOrder);
