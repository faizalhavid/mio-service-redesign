import { Skeleton, View } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ErrorView from "../ErrorView";

// type AsyncProps = {
//   mutation: UseMutationResult<any, any, any>;
//   errorMessage: string;
//   children: React.ReactNode;
// };

const Async = (
  {
    // mutation,
    // errorMessage,
    // children,
  }
): JSX.Element => {
  return (
    <>
      {/* {mutation.isLoading ? (
        <View px={5}>
          <Skeleton width={"100%"} h="100" borderRadius={10} />
        </View>
      ) : mutation.isIdle || mutation.isSuccess ? (
        children
      ) : mutation.isError && errorMessage ? (
        <ErrorView message={errorMessage} />
      ) : (
        <ErrorView message={"Something went wrong!"} />
      )} */}
    </>
  );
};

export default Async;
