// providers/dotrack.provider.js

import axios from "axios";

const dotrackProvider = {
  async getLiveLocation(url) {
    if (!url) {
      throw new Error("Dotrack URL is not configured");
    }

    const { data } = await axios.get(url, {
      timeout: 10000,
    });

    return data;
  },
};

export default dotrackProvider;