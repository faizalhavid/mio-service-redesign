import React from "react";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Center, Fab, Icon, View } from "native-base";
import { SvgCss } from "react-native-svg";
import { HOME_ICON } from "../../commons/assets";

// layout is stored as module variable
let tabBarLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

// there is exported way to get current tabbar height
export function getTabBarHeight() {
  return tabBarLayout.height;
}

// there is simple tab bar component used when creating navigator that will update this layout
export function TabBarComponent(props: BottomTabBarProps) {
  return (
    <View
      collapsable={true}
      onLayout={(event) => {
        tabBarLayout = event.nativeEvent.layout;
      }}
    >
      <BottomTabBar
        {...props}
        insets={{
          top: 0,
          right: 0,
          bottom: 15,
          left: 0,
        }}
      />
    </View>
  );
}
