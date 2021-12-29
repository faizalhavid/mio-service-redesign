import React from "react";
import {
  Button,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = (): JSX.Element => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={require("../../assets/images/homeowner.png")} />
        <View style={{ marginTop: 20 }} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Homeowner
        </Text>
        <View style={{ marginTop: 20 }} />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 20,
            borderColor: "teal",
            width: 120,
            padding: 10,
            backgroundColor: "teal",
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }} />
        <Button title="Sign in" color={"teal"} />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={require("../../assets/images/servicepro.png")} />
        <View style={{ marginTop: 20 }} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Service Pro
        </Text>
        <View style={{ marginTop: 20 }} />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 20,
            borderColor: "teal",
            width: 120,
            padding: 10,
            backgroundColor: "teal",
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }} />
        <Button title="Sign in" color={"teal"} />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
