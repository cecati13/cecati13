export const API_GET = async (API) => {
  try {
    const response = await fetch(API, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
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
    return response.json();
  } catch (error) {
    console.error(error);
  }
};
