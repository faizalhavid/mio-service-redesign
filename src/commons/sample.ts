// Just for testing

import { CURRENT_ENV } from "./environment";

const VARIABLES = {
  DEV: {
    FIRST_NAME: "Thilak",
    LAST_NAME: "K",
    PHONE: "7845715615",
    EMAIL: "kthilagarajan+9may223@gmail.com",
    PASSWORD: "Test@123",
    STREET: "21 Keen Ln",
    CITY: "Edison",
    STATE: "NJ",
    ZIP: "08820",
  },
  //   DEV: {
  //     FIRST_NAME: "",
  //     LAST_NAME: "",
  //     PHONE: "",
  //     EMAIL: "",
  //     PASSWORD: "",
  //     STREET: "",
  //     CITY: "",
  //     STATE: "",
  //     ZIP: "",
  //   },
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
