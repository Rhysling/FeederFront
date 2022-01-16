const dev = {
  "domain": "dev-rbsjv5fo.us.auth0.com",
  "client_id": "LDAABMhgOTuV8Ixu83phtk0BcIG3zrCm",
  "audience": "https://feederapi"
};

const prod = {
  "domain": "TO_COME.auth0.com",
  "client_id": "TO_COME",
  "audience": "https://feederapi"
};


export const getSettings = (isProduction: boolean) => {
  if (isProduction)
    return { auth0: prod };

  return  { auth0: dev };
};
