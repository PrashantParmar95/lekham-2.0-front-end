export const API_BASE_URL = 'http://lekham-plus/'; // change to your backend URL

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}auth/login`,
    LOGOUT: `${API_BASE_URL}auth/logout`,
    LOGIN_OTP: `${API_BASE_URL}auth/login-otp`,
    REGISTER: `${API_BASE_URL}auth/register`,
    REFRESH: `${API_BASE_URL}auth/refresh`
  },
  USER: {
    REGISTER: `${API_BASE_URL}users/register`,
  },
  CATEGORY: {
    ADD_CATEGORY: `${API_BASE_URL}category/add`,
    LIST_CATEGORY: `${API_BASE_URL}category/list`,
  },
  LEKH: {
    MAIN: `${API_BASE_URL}lekh`,
    ADD_LEKH: `${API_BASE_URL}lekh/add`,
    LIST_LEKH: `${API_BASE_URL}lekh/list`,
  },
  LEKH_CATEGORY: {
    ADD_LEKH: `${API_BASE_URL}lekh/add`,
  },
  OPEN_AI: {
    ADD_AI: `${API_BASE_URL}open-ai/prompt`,
  }
};
