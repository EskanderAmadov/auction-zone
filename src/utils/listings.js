import axios from "axios";
import { getToken } from "./token";
import { getAuthHeaders } from "./apiHeaders";


const BASE_URL = "https://v2.api.noroff.dev/auction";

export async function getAuctions(page = 1, limit = 9, sort = "", sortOrder = "desc") {
  const queryParams = new URLSearchParams({
    page,
    limit,
    _bids: "true",
    _seller: "true",
  });

  if (sort) queryParams.append("sort", sort);
  if (sortOrder) queryParams.append("sortOrder", sortOrder);

  const res = await axios.get(`${BASE_URL}/listings?${queryParams.toString()}`);
  return res.data;
}


export async function getAuction(id) {
  const res = await axios.get(`${BASE_URL}/listings/${id}?_bids=true&_seller=true`);
  return res.data;
}

export async function setNewBid(id, price) {
  const res = await axios.post(
    `${BASE_URL}/listings/${id}/bids`,
    { amount: price },
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
}

export async function createListing(data) {
  const res = await axios.post(`${BASE_URL}/listings`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...getAuthHeaders(),
    },
  });
}

export async function deleteListing(id) {
  const res = await axios.delete(`${BASE_URL}/listings/${id}`, {
    headers: getAuthHeaders(),
  });
  return res;
}
