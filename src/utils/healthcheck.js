import axios from "axios";

const BASE_URL = "https://v2.api.noroff.dev";

export async function healthCheck() {
  try {
    const res = await axios.get(`${BASE_URL}/status`);
    return res.data;
  } catch (error) {
    console.error("API Health Check failed:", error);
    return { status: "down" };
  }
}
