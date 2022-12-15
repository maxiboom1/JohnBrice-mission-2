const CACHE_NAME = "auth";
const TOKEN_KEY = "token";
const FAKE_TOKEN = "sRKWQu6hCJgR25lslcf5s12FFVau0ugi";

// Cache Storage was designed for caching
// network requests with service workers,
// mainly to make PWAs work offline.
// You can give it any value you want in this case.
const FAKE_ENDPOINT = "/fake-endpoint";

const saveToken = async (token) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const responseBody = JSON.stringify({
      [TOKEN_KEY]: token
    });
    const response = new Response(responseBody);
    await cache.put(FAKE_ENDPOINT, response);
    console.log("Token saved! 🎉");
  } catch (error) {
    // It's up to you how you resolve the error
    console.log("saveToken error:", { error });
  }
};

const getToken = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(FAKE_ENDPOINT);

    if (!response) {
      return null;
    }

    const responseBody = await response.json();
    return responseBody[TOKEN_KEY];
  } catch (error) {
    // Gotta catch 'em all
    console.log("getToken error:", { error });
  }
};

const displayCachedToken = async () => {
  const cachedToken = await getToken();
  console.log({ cachedToken });
};

// Uncomment the line below to save the fake token
// saveToken(FAKE_TOKEN);

displayCachedToken();



//https://blog.logrocket.com/javascript-cache-api/
