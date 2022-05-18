import { Actionsheet } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type UPDATE_ADDRESS = "UPDATE_ADDRESS";
type UPDATE_PROPERTY = "UPDATE_PROPERTY";
type BOTH = "BOTH";

export type AddressMode = UPDATE_ADDRESS | UPDATE_PROPERTY | BOTH;
export type BathBedOptions = { number: number; selected: boolean };

type AddCardBottomSheetProps = {
  showAddCard: boolean;
  setShowAddCard: Function;
};

export const AddCardBottomSheet = ({
  showAddCard,
  setShowAddCard,
}: AddCardBottomSheetProps): JSX.Element => {
  // const dispatch = useAppDispatch();

  // const {
  //   uiState: customerUiState,
  //   member: customer,
  //   error: customerError,
  // } = useAppSelector(selectCustomer);

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors, isDirty, isValid },
  // } = useForm<SaveCardType>({
  //   defaultValues: {},
  //   mode: "onChange",
  // });

  // const onSubmit = async (data: SaveCardType) => {
  //   data.expMonth = data.expiry.split("/")[0];
  //   data.expYear = data.expiry.split("/")[1];
  //   dispatch(
  //     saveCardAsync({ customerId: customer.customerId, data: data })
  //   ).then((response) => {
  //     let savedCard = response.payload;
  //     if (![200, 201].includes(savedCard?.qbStatus)) {
  //       // setErrorMsg("Invalid Card Credentials!");
  //     } else {
  //       dispatch(getSavedCardsAsync({ customerId: customer.customerId }));
  //     }
  //   });
  // };

  return (
    <Actionsheet
      isOpen={showAddCard}
      onClose={() => setShowAddCard(false)}
      hideDragIndicator={true}
    >
      <Actionsheet.Content
        style={{
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          margin: 0,
          backgroundColor: AppColors.EEE,
        }}
      >
        {/* <VStack pt={15} bg={"white"} width="100%">
          <Center>
            <Text fontSize={18} fontWeight="semibold">
              Update Address
            </Text>
          </Center>
          <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            <VStack px={4} space={0} pb={75} bg={AppColors.EEE}>
              {customerUiState === FAILED && (
                <ErrorView
                  message={
                    "Something went wrong while adding card. Please try again."
                  }
                />
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="text"
                    label="Name"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="name"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="number"
                    label="Card Number"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="number"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="number"
                    expiry={true}
                    label="Valid thru (MM/YYYY)"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="expiry"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="password"
                    label="CVV"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="cvc"
              />
            </VStack>
          </KeyboardAwareScrollView>
        </VStack>
        <FooterButton
          disabled={false}
          minLabel="SAVE"
          maxLabel={"DETAILS"}
          type="ADDRESS"
          onPress={handleSubmit(onSubmit)}
        /> */}
      </Actionsheet.Content>
    </Actionsheet>
  );
};
