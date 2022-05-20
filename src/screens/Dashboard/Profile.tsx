import {
  Circle,
  Divider,
  HStack,
  Pressable,
  Radio,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  getCustomerByIdAsync,
  selectCustomer,
} from "../../slices/customer-slice";
import { getSavedCardsAsync, selectCards } from "../../slices/card-slice";
import { SvgCss } from "react-native-svg";
import { USER_ICON } from "../../commons/assets";
import { AddCardBottomSheet } from "../../components/AddCardBottomSheet";
import { StorageHelper } from "../../services/storage-helper";
import {
  AddressBottomSheet,
  AddressMode,
} from "../../components/AddressBottomSheet";
import { PersonalDetailsBottomSheet } from "../../components/PersonalDetailsBottomSheet";

const Profile = (): JSX.Element => {
  const { logout } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [addressMode, setAddressMode] = useState<AddressMode>("UPDATE_ADDRESS");
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
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
    StorageHelper.getValue("CUSTOMER_ID").then(async (customerId) => {
      if (customerId) {
        dispatch(getCustomerByIdAsync(customerId));
        dispatch(getSavedCardsAsync({ customerId }));
      }
    });
  }, [dispatch]);

  const formatNumber = (number: string) => {
    return number
      .split(/(.{4})/)
      .filter((x) => x.length == 4)
      .join("-")
      .toUpperCase();
  };

  const Title = ({ text }: { text: string }): JSX.Element => {
    return (
      <Text color={AppColors.DARK_PRIMARY} letterSpacing={1} fontSize={12}>
        {text}
      </Text>
    );
  };

  const ValueText = ({ text }: { text: string | number }): JSX.Element => {
    return (
      <Text
        color={AppColors.SECONDARY}
        textTransform={"uppercase"}
        fontWeight={"semibold"}
      >
        {text}
      </Text>
    );
  };

  const ProfileCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="PERSONAL INFORMATION" />
          <Text
            onPress={() => {
              setShowPersonalDetails(true);
            }}
            color={AppColors.DARK_TEAL}
            fontWeight="semibold"
            fontSize={12}
          >
            EDIT
          </Text>
        </HStack>
        <Divider my={1} borderWidth={1} borderColor={AppColors.EEE} />
        <HStack
          mt={2}
          space={5}
          justifyContent="flex-start"
          alignItems={"center"}
        >
          <Circle
            size={60}
            bg={AppColors.EEE}
            children={<SvgCss width={40} height={40} xml={USER_ICON("#eee")} />}
          ></Circle>
          <VStack>
            <ValueText text={`${customer?.firstName} ${customer?.lastName}`} />
            <Text color={AppColors.AAA} fontSize={12} fontWeight={"semibold"}>
              {customer?.email}
            </Text>
            <Text color={AppColors.AAA} fontSize={12} fontWeight={"semibold"}>
              {customer?.phones[0]?.number || "-"}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    );
  };

  const AddressCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="ADDRESS DETAILS" />
          <Text
            color={AppColors.DARK_TEAL}
            fontWeight="semibold"
            onPress={() => {
              setAddressMode("UPDATE_ADDRESS");
              setShowEditAddress(true);
            }}
            fontSize={12}
          >
            EDIT
          </Text>
        </HStack>
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STREET
              </Text>
              <ValueText text={customer?.addresses[0]?.street} />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                CITY
              </Text>
              <ValueText text={customer?.addresses[0]?.city} />
            </VStack>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STATE
              </Text>
              <ValueText text={customer?.addresses[0]?.state} />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                ZIP
              </Text>
              <Text textTransform={"uppercase"} fontWeight={"semibold"}>
                <ValueText text={customer?.addresses[0]?.zip} />
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  const PropertyDetailsCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="PROPERTY DETAILS" />
          <Text
            color={AppColors.DARK_TEAL}
            fontWeight="semibold"
            onPress={() => {
              setAddressMode("UPDATE_PROPERTY");
              setShowEditAddress(true);
            }}
            fontSize={12}
          >
            EDIT
          </Text>
        </HStack>
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                BEDROOM
              </Text>
              <ValueText
                text={customer?.addresses[0]?.houseInfo?.bedrooms || "-"}
              />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                BATHROOM
              </Text>
              <ValueText
                text={customer?.addresses[0]?.houseInfo?.bathrooms || "-"}
              />
            </VStack>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                LOT SIZE
              </Text>
              <ValueText
                text={
                  customer?.addresses[0]?.houseInfo?.lotSize + " sqft" || "-"
                }
              />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                POOL TYPE
              </Text>
              <ValueText
                text={
                  customer?.addresses[0]?.houseInfo?.swimmingPoolType || "-"
                }
              />
            </VStack>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <VStack width={"100%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                PEST TYPE
              </Text>
              <ValueText
                text={
                  customer?.addresses[0]?.houseInfo?.pestType?.join(", ") || "-"
                }
              />
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  const PaymentCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="PAYMENT METHOD" />
          <Text
            color={AppColors.DARK_TEAL}
            fontWeight="semibold"
            onPress={() => setShowAddCard(true)}
            fontSize={12}
          >
            ADD
          </Text>
        </HStack>
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />
        <VStack space={3}>
          {cards.length === 0 && (
            <Text color={"amber.600"} fontSize={14}>
              No cards added yet!
            </Text>
          )}
          {cards.map((card, index) => (
            <HStack justifyContent={"space-between"} key={index}>
              <VStack>
                <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                  {card.cardType}
                </Text>
                <Text textTransform={"uppercase"} fontWeight={"semibold"}>
                  {formatNumber(card.number)}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
    );
  };

  const LogoutCard = (): JSX.Element => {
    return (
      <Pressable
        onPress={async () => {
          await logout();
          navigate("Welcome");
        }}
        bg={"white"}
        mx={3}
        p={5}
        borderRadius={10}
      >
        <VStack>
          <Text
            color={"red.500"}
            fontWeight="semibold"
            letterSpacing={1}
            fontSize={12}
          >
            LOGOUT
          </Text>
        </VStack>
      </Pressable>
    );
  };

  return (
    <AppSafeAreaView mt={0} loading={loading} bg={AppColors.EEE}>
      <ScrollView>
        <VStack pb={150} pt={3} space={3}>
          <ProfileCard />
          <AddressCard />
          <PropertyDetailsCard />
          <PaymentCard />
          <LogoutCard />
        </VStack>
      </ScrollView>
      <FloatingButton onPress={() => navigate("ChooseService")} />
      {showAddCard && (
        <AddCardBottomSheet
          showAddCard={showAddCard}
          setShowAddCard={setShowAddCard}
        />
      )}
      {showEditAddress && (
        <AddressBottomSheet
          mode={addressMode}
          showEditAddress={showEditAddress}
          setShowEditAddress={setShowEditAddress}
          hideAfterSave={true}
        />
      )}
      {showPersonalDetails && (
        <PersonalDetailsBottomSheet
          showPersonalDetails={showPersonalDetails}
          setShowPersonalDetails={setShowPersonalDetails}
        />
      )}
    </AppSafeAreaView>
  );
};

export default Profile;
