import React from "react";
import auth, { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HouseInfo, LeadDetails } from "../commons/types";
import { navigate } from "../navigations/rootNavigation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
import { FLAG_TYPE, STATUS } from "../commons/status";
import { StorageHelper } from "../services/storage-helper";
import { ENV } from "../commons/environment";
import { Skeleton, VStack } from "native-base";

export type RegisterForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  sAccountId?: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  googlePlaceId: string;
  isPrimary?: boolean;
  houseInfo?: HouseInfo;
};

export type CreditCard = {
  cvv: string;
  expiration: string;
  name: string;
  number: string;
  primary: boolean;
  type: string;
  verified: boolean;
};

export type Phone = {
  number: string;
  platform: string;
  preferredCommunication: boolean;
  primary: boolean;
  receiveSMS: boolean;
  type: string;
  usage: string;
  verified: boolean;
};

export type CustomerProfile = {
  customerId: string;
  eaCustomerId: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureURL: string;
  fcmDeviceToken?: string | null;
  sAccountId: string;
  rid: string | null;
  role: string | null;
  uid: string | undefined;
  profileComplete?: boolean;
  paymentCardSaved: boolean;
  firstServiceAdded: boolean;
  phones: Phone[];
  payment: {
    creditCards: CreditCard[];
  };
  addresses: Address[];
  preferences: {
    timeZone: string;
    communicationReceiveTimeStart: string;
    communicationReceiveTimeEnd: string;
    language: string;
  };
};

type AuthContextType = {
  currentUser: FirebaseAuthTypes.User;
  login: (email: string, password: string) => Promise<any>;
  signup: (data: RegisterForm) => Promise<any>;
  logout: () => Promise<any>;
  reload: () => Promise<any>;
  resendEmail: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateEmail: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  getCurrentUser: () => string | null;
  leadDetails: LeadDetails;
  setLeadDetails: (leadDetails: LeadDetails) => void;
  customerProfile: CustomerProfile;
  isViewer: boolean;
  setCustomerProfile: (customerProfile: CustomerProfile) => void;
};

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return React.useContext(AuthContext);
}

export let dummyProfile: CustomerProfile = {
  customerId: "",
  eaCustomerId: "",
  email: "",
  firstName: "",
  lastName: "",
  pictureURL: "",
  sAccountId: "",
  rid: "",
  uid: "",
  role: "",
  paymentCardSaved: false,
  firstServiceAdded: false,
  phones: [],
  payment: {
    creditCards: [],
  },
  addresses: [],
  preferences: {
    timeZone: "UTC",
    communicationReceiveTimeStart: "0900",
    communicationReceiveTimeEnd: "1700",
    language: "English",
  },
};

type AuthProviderType = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderType) {
  const [currentUser, setCurrentUser] = React.useState<FirebaseAuthTypes.User>(
    {} as FirebaseAuthTypes.User
  );
  const [leadDetails, setLeadDetails] = React.useState<LeadDetails>(
    {} as LeadDetails
  );
  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(
    {} as CustomerProfile
  );
  const [loading, setLoading] = React.useState(true);
  const [isViewer, setIsViewer] = React.useState<boolean>(false);

  async function signup(data: RegisterForm): Promise<any> {
    return new Promise(async (resolve, reject) => {
      auth()
        .createUserWithEmailAndPassword(data.email.trim(), data.password)
        .then(async (credential) => {
          setCurrentUser(credential.user);
          let token = await credential.user.getIdToken();
          await StorageHelper.setValue("TOKEN", token);
          if (!data.sAccountId) {
            await credential.user.sendEmailVerification({
              url: ENV.EMAIL_VERIFICATION_URL,
              android: {
                packageName: "com.miohomeservices.customer",
                installApp: true,
              },
              iOS: {
                bundleId: "com.miohomeservices.customer.app",
              },
            });
          }
          await StorageHelper.setValue("CUSTOMER_ID", data.email);

          resolve(credential.user);
        })
        .catch((error: any) => {
          console.log(error?.message);
          if (
            error &&
            error.message &&
            error.message.indexOf("email-already-in-use") > 0
          ) {
            reject(
              "Account already exists. Please login or use different email account"
            );
          } else {
            reject("Something went wrong.");
          }
        });
    });
  }

  function login(email: string, password: string): Promise<any> {
    return new Promise((res, rej) => {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential: FirebaseAuthTypes.UserCredential) => {
          res(userCredential);
        })
        .catch((error) => {
          console.log(error?.message);
          if (
            error &&
            error.message &&
            error.message.indexOf("user-not-found") > 0
          ) {
            rej(
              "Looks like you are new to Mio, please signup before you login"
            );
          } else if (
            error &&
            error.message &&
            error.message.indexOf("auth/wrong-password") > 0
          ) {
            rej("Invalid email/password");
          } else if (
            error &&
            error.message &&
            error.message.indexOf("the user does not have a password") > 0
          ) {
            rej("Invalid Password/Invalid Sign-in Method");
          } else if (
            error &&
            error.message &&
            error.message.indexOf("auth/invalid-email") > 0
          ) {
            rej("Invalid Email");
          } else {
            rej("Something went wrong.");
          }
        });
    });
  }

  const logout = async (): Promise<any> => {
    return new Promise(async (res, rej) => {
      await StorageHelper.clear();
      if (currentUser.providerId === "google.com") {
        await GoogleSignin.signOut();
      }
      if (currentUser.providerId === "apple.com") {
        await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGOUT,
        });
      }
      await firebase.auth().signOut();
      res("");
    });
  };

  function resetPassword(email: string): Promise<any> {
    return auth().sendPasswordResetEmail(email);
  }

  function updateEmail(email: string): Promise<any> {
    return new Promise(async (res, rej) => {
      await currentUser.updateEmail(email);
      res("");
    });
  }

  function updatePassword(password: string): Promise<any> {
    return new Promise(async (res, rej) => {
      await currentUser.updatePassword(password);
      res("");
    });
  }

  function reload(): Promise<any> {
    return new Promise(async (res, rej) => {
      const value = await auth().currentUser?.getIdToken();
      res(value);
    });
  }

  function resendEmail(): Promise<any> {
    return new Promise(async (res, rej) => {
      const value = await currentUser.sendEmailVerification();
      res(value);
    });
  }

  function getCurrentUser(): string | null {
    if (!currentUser) {
      return null;
    }
    let displayName =
      currentUser && currentUser.displayName
        ? currentUser.displayName
        : currentUser.email;
    return displayName;
  }

  function updateScopes(user: FirebaseAuthTypes.User) {
    return new Promise(async (res, rej) => {
      if (user) {
        let result = await user.getIdTokenResult(true);
        if (result?.claims?.["scopes"]) {
          let scopes: any = result?.claims?.["scopes"];
          if (scopes?.customer && scopes?.customer?.length > 1) {
            // console.log("isViewer", scopes.customer[1] === "viewer");
            setIsViewer(scopes.customer[1] === "viewer");
          }
        }
        res(result);
      }
      res({});
    });
  }

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      // console.log("on authstate change", user);
      if (user) {
        StorageHelper.setValue(
          FLAG_TYPE.EMAIL_VERIFICATION_STATUS,
          user.emailVerified ? STATUS.COMPLETED : STATUS.PENDING
        );
        StorageHelper.setValue("CUSTOMER_ID", user.email || "");
        user
          .getIdToken()
          .then((token) => {
            StorageHelper.setValue("TOKEN", token);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error.message);
            logout();
            navigate("Welcome");
          });
        setCurrentUser(user);
        updateScopes(user);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getCurrentUser,
    reload,
    resendEmail,
    leadDetails,
    setLeadDetails,
    customerProfile,
    setCustomerProfile,
    isViewer,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <>
          <VStack space={3} my={3} mx={3}>
            <Skeleton borderRadius={10} height={100} />
            <Skeleton borderRadius={10} height={100} />
            <Skeleton borderRadius={10} height={100} />
            <Skeleton borderRadius={10} height={100} />
            <Skeleton borderRadius={10} height={100} />
            <Skeleton borderRadius={10} height={100} />
            <Skeleton borderRadius={10} height={100} />
          </VStack>
        </>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
