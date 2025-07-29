import { reloadSite } from "./reloadSite.js";

const delayMs = base.delayMsAPI();
const numRetries = base.attemptRetryAPI();

const responseError = async (response) => {
  const status = response.status;
  const res = await response.json();
  return {
    ...res,
    errorCode: status,
  };
};

const delay = (ms) => {
  console.error(`Error, reintentando en ${ms / 1000} segundos...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fetchWithRetry = async (
  endpoint,
  options,
  retries = numRetries
) => {
  try {
    const response = await fetch(endpoint, options);
    if (response.status === 503 && retries > 0) {
      await delay(delayMs);
      return fetchWithRetry(endpoint, options, retries - 1);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (
  endpoint,
  methodRest = "GET",
  retries = numRetries
) => {
  try {
    const objHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await fetch(endpoint, {
      method: methodRest,
      headers: objHeaders,
    });
    if (response.status === 503 && retries > 0) {
      await delay(delayMs);
      return getData(endpoint, methodRest, retries - 1);
    } else if (response.status === 401) {
      reloadSite({
        title: "La sesión caducó",
        message: "¿Deseas recargar la página?",
        buttonText: "Si, recargar!"
      });
    }
    return response.status === 200 ? response.json() : responseError(response);
  } catch (error) {
    console.error(error);
  }
};

export const postFormData = async (
  endpoint,
  formData,
  retries = numRetries
) => {
  try {
    const objHeaders = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: objHeaders,
      body: formData,
    });
    if (response.status === 503 && retries > 0) {
      await delay(delayMs);
      return postFormData(endpoint, formData, retries - 1);
    } else if (response.status === 401) {
      reloadSite({
        title: "La sesión caducó",
        message: "¿Deseas recargar la página?",
        buttonText: "Si, recargar!"
      });
    }
    return response.status === 200 ? response.json() : responseError(response);
  } catch (error) {
    console.error(error);
  }
};
