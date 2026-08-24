import axios from "axios";
// import inventoryData from "./inventoryData.js";
import bartanInventory from './bartanInventory.js'
const BASE_URL = "http://localhost:5000/api/v1/inventory";

const seedInventory = async () => {
  for (const item of bartanInventory) {
    try {
      const response = await axios.post(BASE_URL, item);

      console.log(`✓ Created: ${item.name}`, response.status);
    } catch (error) {
      console.error(
        `✗ Failed: ${item.name}`,
        error.response?.data || error.message,
      );
    }
  }
};

seedInventory();