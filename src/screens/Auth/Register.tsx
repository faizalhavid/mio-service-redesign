import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SocialLoginButton from "../../components/SocialLoginButton";
import Spacer from "../../components/Spacer";

const Register = (): JSX.Element => {
  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", padding: 0, margin: 0 }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <Image
          source={require("../../assets/images/bg.png")}
          width={10}
          height={10}
          style={{
            width: Dimensions.get("screen").width,
            height: 250,
          }}
        />
        <Text
          style={{
            position: "absolute",
            top: 90,
            left: 30,
            fontSize: 20,
            fontWeight: "bold",
            color: "white",
          }}
        >
          Take care of your {"\n"} home from {"\n"}anywhere.
        </Text>
      </View>
      <View
        style={{
          flex: 2,
          backgroundColor: "white",
          marginTop: -60,
          borderTopEndRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <Spacer top={20} />
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Create your account to {"\n"}
          manage your service
        </Text>
        <Spacer top={20} />
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Sign up with
        </Text>
        <Spacer top={20} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SocialLoginButton type="Google" onPress={() => {}} />
          <Spacer left={10} />
          <SocialLoginButton type="Facebook" onPress={() => {}} />
          <Spacer left={10} />
          <SocialLoginButton type="Apple" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
