import analytics from "@react-native-firebase/analytics";

export const useAnalytics = () => {
  return {
    logEvent: async (
      eventName: string,
      params: { [key: string]: any } = {}
    ) => {
      analytics().logEvent(eventName, params);
    },
    logScreenView: async (currentRouteName: string) => {
      analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    },
  };
};
