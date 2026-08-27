// providers/track360.provider.js

import axios from "axios";

const track360Provider = {
  async getLiveLocation(url) {
    if (!url) {
      throw new Error("Track360 URL is not configured");
    }

    const { data } = await axios.get(url, {
      timeout: 10000,
    });

    return data;
  },
};

export default track360Provider;