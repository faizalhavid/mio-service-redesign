import { HStack, Pressable, Spinner, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import { AppColors } from '../../commons/colors';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { navigate } from '../../navigations/rootNavigation';
import { SERVICES } from '../../screens/Home/ChooseService';
import { selectLead } from '../../slices/lead-slice';
import AddressSelectionSheet from '../AddressSelectionSheet';

type FooterButtonProps = {
  type?:
    | 'SERVICE_SELECTION'
    | 'PLAN_SELECTION'
    | 'SCHEDULE_SELECTION'
    | 'DATETIME_SELECTION'
    | 'VIEW_SUMMARY'
    | 'ADDRESS'
    | 'DEFAULT';
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  serviceId?: string;
  subText?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  onCancel?: () => void;
};

function FooterButton({
  type,
  label,
  minLabel,
  maxLabel,
  serviceId,
  onPress,
  onCancel,
  disabled,
  loading = false,
}: FooterButtonProps): JSX.Element {
  const [showSelection, setShowSelection] = useState(false);

  const isAuthenticated = useAuthenticatedUser();

  const { member: leadDetails } = useAppSelector(selectLead);

  const renderSwitch = () => {
    let component: JSX.Element;
    switch (true) {
      case type === 'SCHEDULE_SELECTION' && !isAuthenticated:
        component = (
          <VStack>
            <Text fontWeight="semibold">Almost there!</Text>
            <VStack>
              <Text>
                To Place Order, Please{' '}
                <Text
                  color={AppColors.DARK_TEAL}
                  onPress={() => {
                    navigate('Register');
                  }}
                >
                  Register
                </Text>
                {' or '}
                <Text
                  color={AppColors.DARK_TEAL}
                  onPress={() => {
                    navigate('Login');
                  }}
                >
                  Login
                </Text>
              </Text>
            </VStack>
          </VStack>
        );
        break;
      case type === 'SERVICE_SELECTION':
        component = (
          <Text color="#aaa">
            {leadDetails?.subOrders?.length === 0 ? 'No' : leadDetails?.subOrders?.length} Service
            Selected
          </Text>
        );
        break;
      case type === 'PLAN_SELECTION' || type === 'DATETIME_SELECTION':
        component = (
          <VStack>
            <Text fontWeight="semibold" fontSize={14} color={AppColors.DARK_PRIMARY}>
              {serviceId ? SERVICES[serviceId].text : serviceId}
            </Text>
            <Text color="#aaa">Service</Text>
          </VStack>
        );
        break;
      case type === 'SCHEDULE_SELECTION':
        component = (
          <VStack>
            <Text color="#aaa">Choose Date & Time</Text>
          </VStack>
        );
        break;
      case type === 'ADDRESS':
        component = (
          <VStack alignContent="center">
            <Text fontSize={13} color="#aaa">
              Update Addres &
            </Text>
            <Text fontSize={13} color="#aaa">
              Property Details
            </Text>
          </VStack>
        );
        break;
      case type === 'DEFAULT':
        component = (
          <Pressable
            borderColor={AppColors.EEE}
            backgroundColor={AppColors.EEE}
            height={50}
            borderRadius={5}
            width="48%"
            justifyContent="center"
            borderWidth={1}
            onPress={onCancel}
          >
            <Text
              alignSelf="center"
              color={AppColors.SECONDARY}
              fontWeight="semibold"
              fontSize="12"
            >
              CANCEL
            </Text>
          </Pressable>
        );
        break;

      default:
        component = <View />;
        break;
    }

    return component;
  };

  return (
    <VStack position="absolute" bg="#fff" bottom={0} width="100%">
      {(type === 'SERVICE_SELECTION' ||
        type === 'SCHEDULE_SELECTION' ||
        type === 'VIEW_SUMMARY') && (
        <HStack
          height={42}
          borderTopWidth={1}
          bg="#fff"
          borderColor="#ccc"
          justifyContent="space-between"
          alignItems="center"
          px={5}
        >
          <Text color="#000" fontSize="12" fontWeight="semibold">
            HOME{'   '}
            <Text color="#aaa" alignSelf="center" fontSize="12" fontWeight="semibold">
              {leadDetails?.customerProfile?.addresses?.[0]?.street?.length > 15
                ? `${leadDetails?.customerProfile?.addresses?.[0]?.street?.substring(0, 13)}...`
                : leadDetails?.customerProfile?.addresses?.[0]?.street}
              , {leadDetails?.customerProfile?.addresses?.[0]?.city},{' '}
              {leadDetails?.customerProfile?.addresses?.[0]?.state},{' '}
              {leadDetails?.customerProfile?.addresses?.[0]?.zip}
            </Text>
          </Text>
          {isAuthenticated && (
            <Pressable
              height={50}
              justifyContent="center"
              onPress={() => {
                setShowSelection(true);
              }}
            >
              <Text alignSelf="center" color={AppColors.TEAL} fontWeight="semibold" fontSize="12">
                CHANGE
              </Text>
            </Pressable>
          )}
        </HStack>
      )}
      <HStack
        height={70}
        borderTopWidth={1}
        bg="#fff"
        borderColor="#ccc"
        justifyContent="space-between"
        alignItems="center"
        px={5}
      >
        <>
          {renderSwitch()}
          {!(type === 'SCHEDULE_SELECTION' && !isAuthenticated) && (
            <Pressable
              borderColor={disabled || loading ? '#aaa' : AppColors.TEAL}
              backgroundColor={disabled || loading ? '#aaa' : AppColors.TEAL}
              height={50}
              borderRadius={5}
              width="50%"
              disabled={disabled || loading}
              justifyContent="center"
              borderWidth={1}
              onPress={onPress}
            >
              {loading ? (
                <Spinner color="white" />
              ) : (
                <>
                  {minLabel && maxLabel && (
                    <VStack>
                      <Text alignSelf="center" color="#fff" fontWeight="semibold" fontSize="11">
                        {minLabel}
                      </Text>
                      <Text alignSelf="center" color="#fff" fontWeight="semibold" fontSize="14">
                        {maxLabel}
                      </Text>
                    </VStack>
                  )}
                  {label && (
                    <Text alignSelf="center" color="#fff" fontWeight="semibold" fontSize="14">
                      {label}
                    </Text>
                  )}
                </>
              )}
            </Pressable>
          )}
        </>
      </HStack>
      {showSelection && (
        <AddressSelectionSheet showSelection={showSelection} setShowSelection={setShowSelection} />
      )}
    </VStack>
  );
}

export default FooterButton;
