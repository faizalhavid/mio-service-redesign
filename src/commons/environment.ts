export const CURRENT_ENV: "DEV" | "PROD" = "DEV";

const VARIABLES = {
  DEV: {
    WEB_CLIENT_ID:
      "528727320506-qnn462uhd5d3bac306fg6bkdhs156mhp.apps.googleusercontent.com",
    EMAIL_VERIFICATION_URL: "https://homeservices-dev-ab7f9.web.app",
    API_BASE_URL: "https://homeservices-dev-ab7f9.web.app/api/v2",
  },
  PROD: {
    WEB_CLIENT_ID:
      "383446887463-m54vlaqlcu2r95obouiinj0r3j42m0n2.apps.googleusercontent.com",
    EMAIL_VERIFICATION_URL: "https://homeservices-b769d.web.app",
    API_BASE_URL: "https://miohomeservices.com/api/v2",
  },
};

export const ENV = VARIABLES[CURRENT_ENV];
