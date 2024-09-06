const responseError = async (response)=>{
  const status = response.status;
  const res = await response.json();
  return {
    ...res,
    errorCode: status
  }

}

export const API_GET = async (API) => {
  try {
    const response = await fetch(API, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status === 200 ? response.json(): responseError(response);
  } catch (error) {
    console.error(error);
  }
};

export const API_POST = async (API, formData) => {
  try {
    const response = await fetch(API, {
      method: "POST",
      body: formData,
    });
    return response.status === 200 ? response.json(): responseError(response);
  } catch (error) {
    console.error(error);
  }
};
