import React from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RegisterForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
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
  profileComplete: boolean;
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
  profileComplete: false,
  paymentCardSaved: false,
  firstServiceAdded: false,
  phones: [],
  payment: {
    creditCards: [],
  },
  addresses: [
    {
      street: "",
      city: "",
      state: "AL",
      zip: "",
    },
  ],
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
  const [loading, setLoading] = React.useState(false);

  async function signup(data: RegisterForm): Promise<any> {
    return new Promise(async (resolve, reject) => {
      auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(async (credential) => {
          setCurrentUser(credential.user);
          await credential.user.sendEmailVerification({
            url: "",
            android: { packageName: "com.miohomeservices", installApp: true },
          });
          await AsyncStorage.setItem(
            "idToken",
            await credential.user.getIdToken()
          );
          await AsyncStorage.setItem("customerId", data.email);

          let payload: CustomerProfile = {
            ...dummyProfile,
            ...data,
            customerId: data.email,
          };
          resolve(payload);
        })
        .catch((error: any) => {
          console.log(error);
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
        .then(async (userCredential: any) => {
          await AsyncStorage.setItem("customerId", email);
          console.log("userCredential", userCredential);
          if (userCredential.additionalUserInfo.isNewUser) {
            res("NEW_USER");
          } else if (!userCredential.user.emailVerified) {
            res("VERIFY_EMAIL");
          } else {
            res("HOME");
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error &&
            error.message &&
            error.message.indexOf("user-not-found") > 0
          ) {
            rej("Please Signup and try to Login");
          } else {
            rej("Something went wrong.");
          }
        });
    });
  }

  function logout(): Promise<any> {
    return new Promise(async (res, rej) => {
      await auth().signOut();
      res("");
    });
  }

  function resetPassword(email: string): Promise<any> {
    return new Promise(async (res, rej) => {
      await auth().sendPasswordResetEmail(email);
      res("");
    });
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
  // http://127.0.0.1:9099/emulator/action?mode=verifyEmail&lang=en&oobCode=YuCSW4iyh14U9GEzSn0DRn5NEUhRfnDX6E9h2lm97XGX7WUUPIILEx&apiKey=fake-api-key
  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      console.log("on authstate change", user);
      if (user) {
        setCurrentUser(user);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
