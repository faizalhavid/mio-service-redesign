import * as React from "react";
import {
  StackActions,
  NavigationContainerRef,
  NavigationAction,
  CommonActions,
} from "@react-navigation/native";

export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  React.createRef();
// export const navigation = navigationRef.current
export function navigate(name: string, params?: object): void {
  navigationRef.current?.navigate(name, params);
}
export function dispatch(action: NavigationAction): void {
  navigationRef.current?.dispatch(action);
}
export function replace(name: string, params?: object): void {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}
export function push(name: string, params?: object): void {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}
export function popToPop(name: string, params?: object): void {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: name }, //to go to initial stack screen
      ],
    })
  );
}
export function goBack(): void {
  navigationRef.current?.goBack();
}
export const navigation = {
  navigate,
  dispatch,
  replace,
  push,
  popToPop,
  goBack,
};
