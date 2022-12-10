import { Box, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { AppColors } from '../../commons/colors';
import AppButton from '../../components/AppButton';
import JobCompletedBottomSheet from '../../components/JobCompletedBottomSheet';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getReadableDateTime } from '../../services/utils';
import { getOrderDetailsAsync, selectOrderDetails } from '../../slices/order-slice';

type ChatBubble = {
  user: string;
  message: string;
  images: string[];
  timestamp: string;
};

function Notes(): JSX.Element {
  const userMap: { [key: string]: string } = {
    homeowner: 'customer',
    serviceprovider: 'provider',
  };
  const chatParent = useRef<any>();
  const [showJobCompleted, setShowJobCompleted] = useState<boolean>(false);

  const [reachedBottom, setReachedBottom] = useState<boolean>(false);
  const { isViewer } = useAuth();

  useEffect(() => {
    if (!reachedBottom) {
      chatParent.current.scrollToEnd({ animated: true });
      setReachedBottom(true);
    }
  }, [chatParent, reachedBottom]);

  function LeftChat({ user, message, images, timestamp }: ChatBubble): JSX.Element {
    return (
      <VStack space={1.5} width="90%">
        <Text color={AppColors.SECONDARY} fontWeight="semibold">
          {user}
        </Text>
        {message && (
          <Box
            backgroundColor={AppColors.PRIMARY}
            p={2}
            borderRadius={5}
            style={{ borderTopLeftRadius: 0 }}
          >
            <Text>{message}</Text>
          </Box>
        )}
        <HStack width="100%">
          <HStack space={1.5}>
            {images?.map((image, index) => (
              <Box key={index} borderWidth={1} borderColor={AppColors.PRIMARY} borderRadius={2}>
                <Image
                  source={{
                    width: 80,
                    height: 80,
                    uri: image,
                    cache: 'force-cache',
                  }}
                  alt="photo"
                  bg="gray.200"
                />
              </Box>
            ))}
          </HStack>
        </HStack>
        <Text fontSize={10} color={AppColors.AAA}>
          {getReadableDateTime(timestamp).viewFullDate}
        </Text>
      </VStack>
    );
  }

  function RightChat({ user, message, images, timestamp }: ChatBubble): JSX.Element {
    return (
      <VStack alignItems="flex-end">
        <VStack space={1.5} width="90%">
          <Text textAlign="right" fontWeight="semibold" color={AppColors.SECONDARY}>
            {user}
          </Text>
          {message && (
            <Box
              backgroundColor={AppColors.DARK_TEAL}
              color={AppColors.WHITE}
              p={2}
              borderRadius={5}
              style={{ borderTopRightRadius: 0 }}
            >
              <Text color={AppColors.WHITE}>{message}</Text>
            </Box>
          )}
          <HStack width="100%" direction="row-reverse">
            {images.map((image, index) => (
              <Box
                key={index}
                borderWidth={1}
                ml={1}
                borderColor={AppColors.LIGHT_TEAL}
                borderRadius={2}
              >
                <Image
                  source={{
                    width: 80,
                    height: 80,
                    uri: image,
                    cache: 'force-cache',
                  }}
                  alt="photo"
                  bg="gray.200"
                />
              </Box>
            ))}
          </HStack>
          <Text textAlign="right" fontSize={10} color={AppColors.AAA}>
            {getReadableDateTime(timestamp).viewFullDate}
          </Text>
        </VStack>
      </VStack>
    );
  }

  const dispatch = useAppDispatch();

  const { uiState: orderDetailUiState, member: orderDetail } = useAppSelector(selectOrderDetails);

  const refresh = () => {
    dispatch(
      getOrderDetailsAsync({
        orderId: orderDetail.orderId,
        subOrderId: orderDetail.subOrderId,
      })
    );
  };

  return (
    <>
      <VStack pt={1} px={1} mb={100} width="100%">
        <HStack py={2} px={1} justifyContent="space-between">
          <Text color={AppColors.DARK_TEAL} fontWeight="semibold">
            Service Notes
          </Text>
          <Text onPress={() => refresh()} color={AppColors.DARK_TEAL} fontWeight="semibold">
            Refresh
          </Text>
        </HStack>
        <ScrollView ref={chatParent} height={Dimensions.get('screen').height - 300}>
          <VStack
            space={2}
            p={2}
            // overflow="auto"
            m={1}
            borderWidth={0}
            borderRadius={5}
            // borderColor={AppColors.CCC}
            bgColor={AppColors.WHITE}
          >
            {orderDetail?.serviceNotes?.map((note, index) =>
              note?.notes?.length > 0 || note?.serviceImages?.length > 0 ? (
                note.userType === 'customer' ? (
                  <RightChat
                    key={index}
                    user="You"
                    message={note.notes}
                    images={note.serviceImages}
                    timestamp={note.timestamp}
                  />
                ) : (
                  <LeftChat
                    key={index}
                    user="Provider"
                    message={note.notes}
                    images={note.serviceImages}
                    timestamp={note.timestamp}
                  />
                )
              ) : (
                <VStack key={index} />
              )
            )}
          </VStack>
        </ScrollView>
      </VStack>
      {['NEW', 'ACTIVE', 'SCHEDULED', 'RESCHEDULED', 'CANCELLATION-FAILED'].indexOf(
        orderDetail?.flags?.status
      ) >= 0 &&
        !isViewer && (
          <Box alignSelf="center" position="absolute" bottom={10} width="90%">
            <AppButton
              label="Send Message to Provider"
              type="solid"
              onPress={() => setShowJobCompleted(true)}
            />
          </Box>
        )}
      {showJobCompleted && (
        <JobCompletedBottomSheet
          orderId={orderDetail.orderId}
          subOrderId={orderDetail.subOrderId}
          showJobCompleted={showJobCompleted}
          setShowJobCompleted={setShowJobCompleted}
          title="Share Message"
          btnLabel="SEND"
          status={orderDetail.flags.status}
        />
      )}
    </>
  );
}

export default Notes;
