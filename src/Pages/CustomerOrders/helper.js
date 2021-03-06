import moment from "moment";
import fetchOrderHistory from "../../Apollo/Functions/Fetch/fetchOrderHistory";
import { getOrderTotal } from "../../Helpers";

export const e = "";

const formatOrderHisData = (y, index) => ({
  // index: index + 1,
  name: y?.food?.name || "",
  price: y?.food?.price || "",
  food: y?.food?.id || "",
  quantity: y?.foodOrder?.quantity || "",
});

export const mutationGetFoodOrders = async (filterObj = {}) => {
  const { currentDate, email } = filterObj;
  const sendingData = {
    date: moment(currentDate).format("DD/MM/YYYY"),
    email,
  };
  // console.log({ sendingData });
  const res = await fetchOrderHistory(sendingData);
  // const grouped = _.groupBy(res, (x) => x.email);
  const orderHistory = [];
  const grouped = _.groupBy(res, (order) => order?.foodOrder?.createdAt);
  // console.log({ grouped });
  Object.keys(grouped).forEach((x, i) => {
    const data = _.map(grouped[x], (y, index) => formatOrderHisData(y, index));
    orderHistory.push({
      index: i,
      date: x,
      data,
      notes: grouped[x]?.[0]?.foodOrder?.notes || "",
      destination: grouped[x]?.[0]?.foodOrder?.destination || "",
      status: grouped[x]?.[0]?.foodOrder?.status || "",
      username: grouped[x]?.[0]?.user?.username || "",
      total: getOrderTotal(data),
      address: grouped[x]?.[0]?.user?.address || "",
      phone: grouped[x]?.[0]?.user?.phone || "",
      user: grouped[x]?.[0]?.user || {},
      foodOrderId: grouped[x]?.[0]?.foodOrder?.id || "",
    });
  });
  // console.log({ res, grouped, orderHistory });
  return _.orderBy(orderHistory, [(x) => moment(x.date).valueOf()], ["desc"]);
};
