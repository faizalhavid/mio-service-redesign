import React from "react";
import { View } from "react-native";

type SpacerProps = {
  top?: number;
  left?: number;
};

const Spacer = ({ top = 0, left = 0 }: SpacerProps): JSX.Element => {
  return <View style={{ marginTop: top, marginLeft: left }}></View>;
};

export default Spacer;
