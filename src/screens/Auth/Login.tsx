import { Text } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";

const test = "TEST";
const Content = (
  <>
    <Text color={"green.500"} mt={150}>
      {test}
    </Text>
  </>
);

const Login = (): JSX.Element => {
  return <AppSafeAreaView content={Content}></AppSafeAreaView>;
};

export default Login;
