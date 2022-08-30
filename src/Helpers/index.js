import currencyFormatter from "currency-formatter";

export const temp = "";

export const getPrice = (value = 0, unit = "VND", text = "Price:") => {
  let temp = "";
  switch (unit) {
    case "VND":
      temp = currencyFormatter.format(value, { code: "VND" });
      break;
    default:
      break;
  }
  return `${text} ${temp}`;
};

export const toDataURL = (url, callback) => {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
};

export const getOrderTotal = (data = []) => {
  // console.log({ data });
  let total = 0;
  data.forEach((x) => {
    total += x.price * x.quantity;
  });
  return getPrice(total, undefined, "");
};

export const checkServerErr = (error = {}) => {
  if (
    error?.graphQLErrors?.[0]?.message?.includes("E11000 duplicate key error")
  ) {
    return "Email already existed!";
  }

  return "";
};

export const formatPhone = (phone = "") => {
  if (phone[0] === "0") {
    return "+84" + phone.slice(1);
  }
  if (phone.slice(0, 2) !== "84") {
    return "+84" + phone;
  }
  return "+" + phone;
};
