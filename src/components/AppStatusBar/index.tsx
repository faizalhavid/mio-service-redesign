import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { AppColors } from '../../commons/colors';

type AppStatusBarProps = {
  color?: string;
  ishidden?: boolean;
};

export function AppStatusBar({ color, ishidden }: AppStatusBarProps) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <StatusBar
      animated
      backgroundColor={AppColors.TEAL}
      hidden={ishidden}
      barStyle="dark-content"
      showHideTransition="slide"
    />
  );
}

const styles = StyleSheet.create({});
