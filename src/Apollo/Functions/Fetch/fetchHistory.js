import axios from "axios";
import { CONFIG } from "../../../Constants";
import auth from "../../../Helpers/auth";

const fetchHistory = async () => {
  try {
    const Authorization = auth.getToken();
    // console.log({ Authorization });
    const res = await axios({
      method: "GET",
      url: `${CONFIG.APOLLO_HOST_URL}/api/foodorder/history`,
      headers: {
        Authorization,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default fetchHistory;