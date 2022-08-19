import {
  Center,
  Circle,
  Divider,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";
import { Address, useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  deleteAddressAsync,
  getCustomerByIdAsync,
  selectAddress,
  selectCustomer,
} from "../../slices/customer-slice";
import { getSavedCardsAsync, selectCards } from "../../slices/card-slice";
import { AddCardBottomSheet } from "../../components/AddCardBottomSheet";
import { StorageHelper } from "../../services/storage-helper";
import {
  AddressBottomSheet,
  AddressMode,
} from "../../components/AddressBottomSheet";
import { PersonalDetailsBottomSheet } from "../../components/PersonalDetailsBottomSheet";
import { Alert } from "react-native";
import { version } from "../../../package.json";
import AddressListItem from "../../components/AddressListItem";
import {
  getInvitedUsersAsync,
  selectInvitedUsers,
} from "../../slices/invite-slice";
import InviteBottomSheet from "../../components/InviteBottomSheet";

const Profile = (): JSX.Element => {
  const { logout, isViewer } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [addressMode, setAddressMode] = useState<AddressMode>("NEW_ADDRESS");
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const { collection: invitedUsers, uiState: invitedUsersUiState } =
    useAppSelector(selectInvitedUsers);
  const [selectedAddress, setSelectedAddress] = useState({} as Address);
  const dispatch = useAppDispatch();
  const { uiState: addressesUiState } = useAppSelector(selectAddress);

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

  const [invitedUsersLoaded, setInvitedUsersLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (customer?.sAccountId && !invitedUsersLoaded) {
      dispatch(getInvitedUsersAsync({ serviceAccountId: customer.sAccountId }));
      setInvitedUsersLoaded(true);
    }
  }, [customer]);

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
        fontSize={13}
      >
        {text}
      </Text>
    );
  };

  const EditButton = ({
    text,
    color,
    px,
    onPress,
  }: {
    text: string;
    px?: number;
    color?: string;
    onPress: () => void;
  }): JSX.Element => {
    return (
      <Pressable
        onPress={onPress}
        px={px === undefined ? 2 : px}
        borderRadius={5}
        _pressed={{ backgroundColor: AppColors.LIGHT_TEAL }}
      >
        <Text
          color={color || AppColors.DARK_TEAL}
          fontWeight="semibold"
          fontSize={12}
        >
          {text}
        </Text>
      </Pressable>
    );
  };

  const ProfileCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="PERSONAL INFORMATION" />
          <EditButton
            onPress={() => {
              setShowPersonalDetails(true);
            }}
            text="EDIT"
          />
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
            children={
              Boolean(customer.pictureURL) && (
                <Image
                  borderRadius={60}
                  source={{
                    width: 60,
                    height: 60,
                    uri: customer.pictureURL,
                    cache: "force-cache",
                  }}
                  alt="Profile"
                  bg={"gray.200"}
                />
              )
            }
          ></Circle>
          <VStack>
            <ValueText
              text={`${customer?.firstName || "-"} ${
                customer?.lastName || "-"
              }`}
            />
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
          {!isViewer && (
            <EditButton
              onPress={() => {
                setAddressMode("NEW_ADDRESS");
                setShowEditAddress(true);
              }}
              text="ADD"
            />
          )}
        </HStack>
        <Divider my={1} mb={1.5} borderWidth={1} borderColor={AppColors.EEE} />
        {customerUiState === "IN_PROGRESS" ||
        addressesUiState === "IN_PROGRESS" ? (
          <>
            <Spinner
              key={"ADDRESS_SPINNER"}
              alignSelf={"flex-start"}
              color={AppColors.PRIMARY}
              size="sm"
            />
          </>
        ) : (
          <VStack
            divider={
              <Divider
                thickness={0.8}
                mt={2}
                mb={2}
                borderStyle={"dashed"}
                bg={AppColors.CCC}
              />
            }
          >
            {customer?.addresses?.map((addressItem, index) => (
              <AddressListItem
                key={index}
                address={addressItem}
                position={index + 1}
                showEdit={!isViewer}
                showDelete={!isViewer}
                onEdit={(address) => {
                  setSelectedAddress(address);
                  setAddressMode("UPDATE_ADDRESS");
                  setShowEditAddress(true);
                }}
                onDelete={(address) => {
                  Alert.alert("Delete Address", "Are you sure?", [
                    {
                      text: "Cancel",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        await dispatch(
                          deleteAddressAsync({
                            serviceAccountId: customer.sAccountId,
                            propertyId: address.googlePlaceId,
                          })
                        ).then(() => {});
                        dispatch(getCustomerByIdAsync(customer.customerId));
                      },
                    },
                  ]);
                }}
              />
            ))}
          </VStack>
        )}
      </VStack>
    );
  };

  const InviteCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="MANAGER USERS" />
          {!isViewer && (
            <EditButton
              onPress={() => {
                setShowAddUser(true);
              }}
              text="ADD"
            />
          )}
        </HStack>
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />
        <VStack space={3}>
          {invitedUsersUiState === "IN_PROGRESS" && (
            <Spinner
              alignSelf={"flex-start"}
              color={AppColors.PRIMARY}
              size="sm"
            />
          )}
          {invitedUsersUiState !== "IN_PROGRESS" && invitedUsers.length === 0 && (
            <Text color={"amber.600"} fontSize={14}>
              No user invited yet!
            </Text>
          )}
          {invitedUsersUiState === "SUCCESS" &&
            invitedUsers.map((user, index) => (
              <VStack key={index}>
                <HStack
                  justifyContent={"space-between"}
                  alignItems="center"
                  key={index}
                >
                  <Text
                    color={AppColors.AAA}
                    textTransform="uppercase"
                    letterSpacing={1}
                    fontSize={12}
                  >
                    {user.claim}
                  </Text>
                  {user.status !== "COMPLETED" && (
                    <Text color={AppColors.WARNING} fontSize={12}>
                      {user.status}
                    </Text>
                  )}
                </HStack>
                <VStack>
                  <Text
                    color={AppColors.SECONDARY}
                    fontWeight={"semibold"}
                    fontSize={13}
                  >
                    {user.email}
                  </Text>
                </VStack>
              </VStack>
            ))}
        </VStack>
      </VStack>
    );
  };

  const PaymentCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <HStack justifyContent={"space-between"}>
          <Title text="PAYMENT METHOD" />
          {!isViewer && (
            <EditButton
              onPress={() => {
                setShowAddCard(true);
              }}
              text="ADD"
            />
          )}
        </HStack>
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />
        <VStack space={3}>
          {cardsUiState === "IN_PROGRESS" && (
            <Spinner
              alignSelf={"flex-start"}
              color={AppColors.PRIMARY}
              size="sm"
            />
          )}
          {cardsUiState !== "IN_PROGRESS" && cards.length === 0 && (
            <Text color={"amber.600"} fontSize={14}>
              No cards added yet!
            </Text>
          )}
          {cardsUiState === "SUCCESS" &&
            cards.map((card, index) => (
              <HStack justifyContent={"space-between"} key={index}>
                <VStack>
                  <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                    {card.cardType}
                  </Text>
                  <ValueText text={formatNumber(card.number)} />
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
          Alert.alert("Logout", "Would you like to logout?", [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Logout",
              style: "destructive",
              onPress: async () => {
                await logout();
                navigate("Welcome");
              },
            },
          ]);
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
    <AppSafeAreaView loading={loading} bg={AppColors.EEE}>
      <ScrollView>
        <VStack pb={150} pt={3} space={3}>
          <ProfileCard />
          <AddressCard />
          <InviteCard />
          <PaymentCard />
          <LogoutCard />
          <Center my={3}>
            <Text color={"#ccc"}>v{version}</Text>
          </Center>
        </VStack>
      </ScrollView>
      {!isViewer && <FloatingButton />}
      {showAddUser && (
        <InviteBottomSheet
          showInviteUser={showAddUser}
          setShowInviteUser={setShowAddUser}
        />
      )}
      {showAddCard && (
        <AddCardBottomSheet
          showAddCard={showAddCard}
          setShowAddCard={setShowAddCard}
        />
      )}
      {showEditAddress && (
        <AddressBottomSheet
          mode={addressMode}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
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
