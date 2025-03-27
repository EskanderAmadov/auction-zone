import { getToken } from "./token";

const API_KEY = "47192099-694b-4186-a96f-0dbbc0951cbf";

export function getAuthHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    "X-Noroff-API-Key": API_KEY,
  };
}
