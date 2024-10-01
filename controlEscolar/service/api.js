const delayMs = base.delayMsAPI();

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

export const fetchWithRetry = async (endpoint, options, retries = 3) => {
  try {
    const response = await fetch(endpoint, options);
    if (response.status === 500 && retries > 0) {
      await delay(delayMs);
      return fetchWithRetry(endpoint, options, retries - 1);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (endpoint, methodRest = "GET", retries = 3) => {
  try {
    const objHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await fetch(endpoint, {
      method: methodRest,
      headers: objHeaders,
    });
    console.log(response);
    if (response.status === 500 && retries > 0) {
      await delay(delayMs);
      return getData(endpoint, methodRest, retries - 1);
    }
    return response.status === 200 ? response.json() : responseError(response);
  } catch (error) {
    console.error(error);
  }
};

// async sendData(API, obj) {
//   try {
//     this.preloader();
//     const objHeaders = { "Content-Type": "application/json" };
//     if (!obj.username) {
//       Object.defineProperty(objHeaders, "Authorization", {
//         value: `Bearer ${localStorage.getItem("token")}`,
//         writable: true,
//         enumerable: true,
//         configurable: true,
//       });
//     }
//     const response = await fetch(API, {
//       method: "POST",
//       headers: objHeaders,
//       body: JSON.stringify(obj),
//     });
//     this.preloader();
//     return response.json();
//   } catch (error) {
//     console.error(error);
//   }
// },
