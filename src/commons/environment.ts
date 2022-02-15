const LOCAL = "LOCAL";
var GOOGLE_WEB_CLIENT_ID =
  "528727320506-qnn462uhd5d3bac306fg6bkdhs156mhp.apps.googleusercontent.com";

const CURRENT_ENV = process.env["CURRENT_ENV"];
if (CURRENT_ENV === LOCAL) {
  GOOGLE_WEB_CLIENT_ID =
    "528727320506-qnn462uhd5d3bac306fg6bkdhs156mhp.apps.googleusercontent.com";
}

export const ENV = {
  GOOGLE_WEB_CLIENT_ID,
};
