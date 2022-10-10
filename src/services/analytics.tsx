import analytics from "@react-native-firebase/analytics";

const Analytics = analytics();

export const useAnalytics = () => ({
    logEvent: async (
      eventName: string,
      params: { [key: string]: any } = {}
    ) => {
      Analytics.logEvent(eventName, params);
    },
    logScreenView: async (currentRouteName: string) => {
      Analytics.logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    },
    setEnabled: (enabled: boolean) => {
      Analytics.setAnalyticsCollectionEnabled(enabled);
    },
    setUserId: (userId: string) => {
      Analytics.setUserId(userId);
    },
    setUserProperty: (name: string, property: string) => {
      Analytics.setUserProperty(name, property);
    },
  });
