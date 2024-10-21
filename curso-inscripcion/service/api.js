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

export const API_GET = async (API, retries = numRetries) => {
  try {
    const response = await fetch(API, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 503 && retries > 0) {
      await delay(delayMs);
      return API_GET(API, retries - 1);
    }
    return response.status === 200 ? response.json() : responseError(response);
  } catch (error) {
    console.error(error);
  }
};

export const API_POST = async (API, formData, retries = numRetries) => {
  try {
    const response = await fetch(API, {
      method: "POST",
      body: formData,
    });
    console.log(retries);
    if (response.status === 500 && retries > 0) {
      await delay(delayMs);
      return API_POST(API, formData, retries - 1);
    }
    return response.status === 200 ? response.json() : responseError(response);
  } catch (error) {
    console.error(error);
  }
};
