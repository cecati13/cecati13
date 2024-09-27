import { fetchWithRetry } from "./api.js";

export const callApi = async (method, endpoint, token, data = null) => {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  if (data) {
    headers.append("Content-Type", "application/json");
  }

  const options = {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : null,
    credentials: "include",
  };

  const response = await fetchWithRetry(endpoint, options);

  const contentType = response.headers.get("content-type");
  return contentType && contentType.indexOf("application/json") !== -1
    ? response.json()
    : response;
};

export const getTokenRedirect = (request) => {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  request.account = myMSALObj.getAccountByUsername(username);
  return myMSALObj.acquireTokenSilent(request).catch((error) => {
    console.error(error);
    console.warn("silent token acquisition fails. acquiring token using popup");
    if (error instanceof msal.InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenRedirect(request);
    } else {
      console.error(error);
      setTimeout(() => {
        this.preloader();
        this.message =
          "Hubo un error al iniciar sesión. Por favor recarga el sitio.";
      }, 2000);
    }
  });
};

export const getToken = async () => {
  let tokenResponse;
  if (typeof getTokenPopup === "function") {
    tokenResponse = await getTokenPopup({
      scopes: [],
      redirectUri: "/redirect",
    });
  } else {
    tokenResponse = await getTokenRedirect({
      scopes: ["User.Read"],
    });
  }

  if (!tokenResponse) {
    return null;
  }
  return tokenResponse.accessToken;
};
