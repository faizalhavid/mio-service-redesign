import { Text } from "native-base";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type SocialLoginButtonProps = {
  type: "Google" | "Facebook" | "Apple" | undefined;
  onPress: Function;
};

const SocialLoginButton = ({
  type,
  onPress,
}: SocialLoginButtonProps): JSX.Element => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      {type == "Google" && (
        <View style={styles.button}>
          <Image
            source={require("../../assets/images/google.png")}
            style={styles.logo}
          />
          <Text style={styles.text}>Google</Text>
        </View>
      )}
      {type == "Facebook" && (
        <View style={[styles.button, { width: 100 }]}>
          <Image
            source={require("../../assets/images/fb.png")}
            style={styles.logo}
          />
          <Text style={styles.text}>Facebook</Text>
        </View>
      )}
      {type == "Apple" && (
        <View style={styles.button}>
          <Image
            source={require("../../assets/images/apple.png")}
            style={styles.logo}
          />
          <Text style={styles.text}>Apple</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    width: 80,
    height: 30,
    borderRadius: 20,
  },
  logo: {
    width: 20,
    height: 20,
  },
  text: {
    marginLeft: 2,
    fontWeight: "400",
    fontSize: 14,
  },
});
