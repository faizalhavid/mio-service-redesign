import React from "react";

// type AsyncProps = {
//   mutation: UseMutationResult<any, any, any>;
//   errorMessage: string;
//   children: React.ReactNode;
// };

function Async({
    // mutation,
    // errorMessage,
    // children,
  }): JSX.Element {
  return (
    <>
      {/* {mutation.isLoading ? (
        <View px={5}>
          <VStack space={1} mt={5} mx={3}>
          <Skeleton borderRadius={10} h="40" startColor={"gray.300"} />
          <Skeleton.Text startColor={"gray.300"} />
          <Skeleton borderRadius={10} h="40" startColor={"gray.300"} />
          <Skeleton.Text startColor={"gray.300"} />
        </VStack>
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
}

export default Async;
