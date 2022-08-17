// Just for testing

import { CURRENT_ENV } from "./environment";

const VARIABLES = {
  // DEV: {
  //   FIRST_NAME: "Thilak",
  //   LAST_NAME: "K",
  //   PHONE: "7845715615",
  //   EMAIL: "kthilagarajan+16aug22@gmail.com",
  //   PASSWORD: "Test@123",
  //   STREET: "1301 Ridgefield Loo",
  //   CITY: "Round Rock",
  //   STATE: "TX",
  //   ZIP: "78665",
  // },
  DEV: {
    FIRST_NAME: "Thilak",
    LAST_NAME: "K",
    PHONE: "7845715615",
    EMAIL: "kthilagarajan+16aug2203@gmail.com",
    PASSWORD: "Test@123",
    STREET: "",
    CITY: "",
    STATE: "",
    ZIP: "",
  },
  PROD: {
    FIRST_NAME: "",
    LAST_NAME: "",
    PHONE: "",
    EMAIL: "",
    PASSWORD: "",
    STREET: "",
    CITY: "",
    STATE: "",
    ZIP: "",
  },
};

export const SAMPLE = VARIABLES[CURRENT_ENV];
