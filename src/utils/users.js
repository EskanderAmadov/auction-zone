import axios from "axios";
import { getToken } from "./token";
import { getAuthHeaders } from "./apiHeaders";

const BASE_URL = "https://v2.api.noroff.dev";

export async function registerNewUser(data) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function userLogin(data) {
  const res = await axios.post(`${BASE_URL}/auth/login`, data);
  return res.data;
}

export function hasNoWhitespaces(str) {
  return !/\s/.test(str);
}

export async function getAllUsers(offset = 0) {
  const res = await axios.get(
    `${BASE_URL}/auction/profiles?limit=100&_listings=true&offset=${offset}`,
    { headers: getAuthHeaders() }
  );
  return res.data;
}

export async function getUser(name) {
  if (!name) return;

  const res = await axios.get(
    `${BASE_URL}/auction/profiles/${name}?_listings=true`,
    { headers: getAuthHeaders() }
  );

  return res.data;
}

export async function putNewAvatar(name, avatarObj) {
  if (!avatarObj?.url) return;

  const inputData = {
    avatar: {
      url: avatarObj.url,
      alt: avatarObj.alt || `${name}'s avatar`,
    },
  };

  const res = await axios.put(
    `${BASE_URL}/auction/profiles/${name}`,
    inputData,
    { headers: getAuthHeaders() }
  );

  return res.data;
}

export async function getUserListings(name) {
  const res = await axios.get(
    `${BASE_URL}/auction/profiles/${name}/listings`,
    { headers: getAuthHeaders() }
  );
  return res.data;
}

export async function getUserWins(name) {
  const res = await axios.get(
    `${BASE_URL}/auction/profiles/${name}/wins`,
    { headers: getAuthHeaders() }
  );
  return res.data;
}

export async function getUserBids(name) {
  const res = await axios.get(
    `${BASE_URL}/auction/profiles/${name}/bids?_listings=true`,
    { headers: getAuthHeaders() }
  );
  return res.data;
}
