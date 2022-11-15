export const CURRENT_ENV: 'DEV' | 'UAT' | 'PROD' = 'DEV';

const VARIABLES = {
  DEV: {
    GOOGLE_MAPS_API_KEY: 'AIzaSyCSGeamOt2amMpUO-8wmTplOdIKJChVgOY',
    WEB_CLIENT_ID: '528727320506-qnn462uhd5d3bac306fg6bkdhs156mhp.apps.googleusercontent.com',
    EMAIL_VERIFICATION_URL: 'https://homeservices-dev-ab7f9.firebaseapp.com',
    API_BASE_URL: 'https://homeservices-dev-ab7f9.firebaseapp.com/api/v2',
  },
  UAT: {
    GOOGLE_MAPS_API_KEY: 'AIzaSyCSGeamOt2amMpUO-8wmTplOdIKJChVgOY',
    WEB_CLIENT_ID: '469555711769-op88eerrdfkphk4jpk7esdpgarnd4ihf.apps.googleusercontent.com',
    EMAIL_VERIFICATION_URL: 'https://homeservices-uat-8982a.firebaseapp.com',
    API_BASE_URL: 'https://homeservices-uat-8982a.firebaseapp.com/api/v2',
  },
  PROD: {
    GOOGLE_MAPS_API_KEY: 'AIzaSyC-PV6vnfnDTInXvH5ug45lt_PukCICp7k',
    WEB_CLIENT_ID: '383446887463-m54vlaqlcu2r95obouiinj0r3j42m0n2.apps.googleusercontent.com',
    EMAIL_VERIFICATION_URL: 'https://homeservices-b769d.firebaseapp.com',
    API_BASE_URL: 'https://app.miohomeservices.com/api/v2',
  },
};

export const ENV = VARIABLES[CURRENT_ENV];
