import { ScrollView, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCustomer } from "../../slices/customer-slice";
import { selectCards } from "../../slices/card-slice";

const [showAddCard, setShowAddCard] = useState(false);

const Profile = (): JSX.Element => {
  const { logout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const dispatch = useAppDispatch();

  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  const {
    uiState: cardsUiState,
    collection: cards,
    error: cardsError,
  } = useAppSelector(selectCards);

  useEffect(() => {
    // StorageHelper.getValue("CUSTOMER_ID").then(async (customerId) => {
    //   if (customerId) {
    //     dispatch(getCustomerByIdAsync(customerId));
    //     dispatch(getSavedCardsAsync({ customerId }));
    //   }
    // });
  }, [dispatch]);

  const formatNumber = (number: string) => {
    return number
      .split(/(.{4})/)
      .filter((x) => x.length == 4)
      .join("-")
      .toUpperCase();
  };

  // const ProfileCard = (): JSX.Element => {
  //   return (
  //     <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
  //       <HStack justifyContent={"space-between"}>
  //         <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //           PERSONAL INFORMATION
  //         </Text>
  //         <Text color={"blue.400"} fontWeight="semibold" fontSize={12}>
  //           EDIT
  //         </Text>
  //       </HStack>
  //       <Divider my={1} borderWidth={1} borderColor={AppColors.EEE} />
  //       <HStack
  //         mt={2}
  //         space={5}
  //         justifyContent="flex-start"
  //         alignItems={"center"}
  //       >
  //         <Circle
  //           size={60}
  //           bg={AppColors.EEE}
  //           children={<SvgCss width={40} height={40} xml={USER_ICON("#eee")} />}
  //         ></Circle>
  //         <VStack>
  //           <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //             {customer?.firstName} {customer?.lastName}
  //           </Text>
  //           <Text color={AppColors.AAA} fontSize={12} fontWeight={"semibold"}>
  //             {customer?.email}
  //           </Text>
  //           <Text color={AppColors.AAA} fontSize={12} fontWeight={"semibold"}>
  //             {customer?.phones[0]?.number || "-"}
  //           </Text>
  //         </VStack>
  //       </HStack>
  //     </VStack>
  //   );
  // };

  // const AddressCard = (): JSX.Element => {
  //   return (
  //     <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
  //       <HStack justifyContent={"space-between"}>
  //         <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //           ADDRESS DETAILS
  //         </Text>
  //         <Text color={"blue.400"} fontWeight="semibold" fontSize={12}>
  //           EDIT
  //         </Text>
  //       </HStack>
  //       <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

  //       <VStack space={3}>
  //         <HStack justifyContent={"space-between"}>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               STREET
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.street}
  //             </Text>
  //           </VStack>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               CITY
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.city}
  //             </Text>
  //           </VStack>
  //         </HStack>
  //         <HStack justifyContent={"space-between"}>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               STATE
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.state}
  //             </Text>
  //           </VStack>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               ZIP
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.zip}
  //             </Text>
  //           </VStack>
  //         </HStack>
  //       </VStack>
  //     </VStack>
  //   );
  // };

  // const PropertyDetailsCard = (): JSX.Element => {
  //   return (
  //     <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
  //       <HStack justifyContent={"space-between"}>
  //         <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //           PROPERTY DETAILS
  //         </Text>
  //         <Text color={"blue.400"} fontWeight="semibold" fontSize={12}>
  //           EDIT
  //         </Text>
  //       </HStack>
  //       <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

  //       <VStack space={3}>
  //         <HStack justifyContent={"space-between"}>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               BEDROOM
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.houseInfo?.bedrooms}
  //             </Text>
  //           </VStack>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               BATHROOM
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.houseInfo?.bathrooms}
  //             </Text>
  //           </VStack>
  //         </HStack>
  //         <HStack justifyContent={"space-between"}>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               LOT SIZE
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.houseInfo?.lotSize} sqft
  //             </Text>
  //           </VStack>
  //           <VStack width={"50%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               POOL TYPE
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.houseInfo?.swimmingPoolType}
  //             </Text>
  //           </VStack>
  //         </HStack>
  //         <HStack justifyContent={"space-between"}>
  //           <VStack width={"100%"}>
  //             <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //               PEST TYPE
  //             </Text>
  //             <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //               {customer?.addresses[0]?.houseInfo?.pestType?.join(",")}
  //             </Text>
  //           </VStack>
  //         </HStack>
  //       </VStack>
  //     </VStack>
  //   );
  // };

  // const PaymentCard = (): JSX.Element => {
  //   return (
  //     <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
  //       <HStack justifyContent={"space-between"}>
  //         <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //           PAYMENT METHOD
  //         </Text>
  //         <Text
  //           color={"blue.400"}
  //           fontWeight="semibold"
  //           // onPress={() => setShowAddCard(true)}
  //           fontSize={12}
  //         >
  //           ADD
  //         </Text>
  //       </HStack>
  //       <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />
  //       <VStack space={3}>
  //         {cards.length === 0 && (
  //           <Text color={"amber.600"} fontSize={14}>
  //             No cards added yet!
  //           </Text>
  //         )}
  //         {cards.map((card, index) => (
  //           <HStack justifyContent={"space-between"}>
  //             <VStack>
  //               <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
  //                 VISA [DEFAULT]
  //               </Text>
  //               <Radio key={index} ml={2} my={1} value={card.number}>
  //                 <Text textTransform={"uppercase"} fontWeight={"semibold"}>
  //                   {formatNumber(card.number)}
  //                 </Text>
  //               </Radio>
  //             </VStack>
  //           </HStack>
  //         ))}
  //       </VStack>
  //     </VStack>
  //   );
  // };

  // const LogoutCard = (): JSX.Element => {
  //   return (
  //     <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
  //       <Text
  //         color={"red.500"}
  //         fontWeight="semibold"
  //         letterSpacing={1}
  //         fontSize={12}
  //       >
  //         LOGOUT
  //       </Text>
  //     </VStack>
  //   );
  // };

  return (
    <AppSafeAreaView mt={0} loading={loading} bg={AppColors.EEE}>
      <ScrollView>
        <VStack pb={150} pt={3} space={3}>
          {/* <ProfileCard />
          <AddressCard />
          <PropertyDetailsCard />
          <PaymentCard />
          <LogoutCard /> */}
        </VStack>
      </ScrollView>
      <FloatingButton onPress={() => navigate("ChooseService")} />
      {/* {showAddCard && (
        <AddCardBottomSheet
          showAddCard={showAddCard}
          setShowAddCard={setShowAddCard}
        />
      )} */}
    </AppSafeAreaView>
  );
};

export default Profile;
