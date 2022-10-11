import { firebase } from '@react-native-firebase/storage';
import {
  Actionsheet,
  Center,
  HStack,
  Image,
  Pressable,
  Spinner,
  Text,
  TextArea,
  Toast,
  VStack,
} from 'native-base';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { SvgCss } from 'react-native-svg';
import { PLUS_ICON } from '../../commons/assets';
import { AppColors } from '../../commons/colors';
import { OrderStatus } from '../../commons/types';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  getOrderDetailsAsync,
  selectJobStatus,
  selectOrderDetails,
  udpateJobStatusAsync,
} from '../../slices/order-slice';
import { setRefreshNeeded } from '../../slices/shared-slice';
import ErrorView from '../ErrorView';
import FooterButton from '../FooterButton';

type JobCompletedBottomSheetProps = {
  orderId: string;
  subOrderId: string;
  showJobCompleted: boolean;
  setShowJobCompleted: Function;
};

function JobCompletedBottomSheet({
  orderId,
  subOrderId,
  showJobCompleted,
  setShowJobCompleted,
}: JobCompletedBottomSheetProps): JSX.Element {
  const { member: orderDetail } = useAppSelector(selectOrderDetails);
  const dispatch = useAppDispatch();
  const { member: jobStatus, uiState: jobStatusUiState } = useAppSelector(selectJobStatus);
  const [errorMsg, setErrorMsg] = useState('');
  const [serviceNotes, setServiceNotes] = useState<any>({});
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  return (
    <Actionsheet
      isOpen={showJobCompleted}
      onClose={() => setShowJobCompleted(false)}
      hideDragIndicator
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
        <VStack pt={15} bg="white" width="100%">
          <Center>
            <Text fontSize={18} fontWeight="semibold">
              Update Job Status
            </Text>
          </Center>
          <VStack mt={3} pt={3} px={4} pb={5} bg={AppColors.EEE} space={1}>
            <ErrorView message={errorMsg} />
            <Text fontWeight="semibold" fontSize={14}>
              Service Images
            </Text>
            <HStack space={2} bg="#eee" pt={1}>
              {!loading &&
                serviceImages.map((image, index) => (
                  <Pressable
                    key={index}
                    onLongPress={() => {
                      // TODO: Deleve image from firestore
                      setLoading(true);
                      let cache = [...serviceImages];
                      cache = cache.filter((img) => img !== image);
                      setServiceImages(cache);
                      setLoading(false);
                    }}
                    onPress={() => {
                      Toast.show({
                        title: 'Long press to remove!',
                      });
                    }}
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
                  </Pressable>
                ))}
              <Pressable
                borderWidth={1}
                borderColor={AppColors.TEAL}
                borderStyle="dashed"
                height={20}
                width={20}
                justifyContent="center"
                alignItems="center"
                onPress={() => {
                  if (serviceImages.length === 3) {
                    Toast.show({
                      title:
                        'Not allowed more than 3 images. Long-press previously uploaded images to remove!',
                      textAlign: 'center',
                    });
                    return;
                  }
                  ImagePicker.launchImageLibrary(
                    {
                      mediaType: 'photo',
                      includeBase64: false,
                      selectionLimit: 1,
                      maxHeight: 200,
                      maxWidth: 200,
                    },
                    (response: any) => {
                      // console.log("Response = ", response);

                      if (response.didCancel) {
                        console.log('User cancelled image picker');
                      } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                      } else {
                        setLoading(true);
                        const { fileName, uri } = response.assets[0];
                        const imageRef = `users/${currentUser.uid}/${
                          orderDetail?.serviceId
                        }-${new Date().getTime()}.${fileName.split('.')[1]}`;
                        firebase
                          .storage()
                          .ref(imageRef)
                          .putFile(uri)
                          .then(async (snapshot) => {
                            const imageDownload = firebase.storage().ref(imageRef);
                            const url = await imageDownload.getDownloadURL();
                            setServiceImages([...serviceImages, url]);
                            setLoading(false);
                          })
                          .catch(() => {
                            setLoading(false);
                          });
                      }
                    }
                  );
                }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <SvgCss width={20} height={20} xml={PLUS_ICON(AppColors.TEAL)} />
                )}
              </Pressable>
            </HStack>
            <Text fontWeight="semibold" fontSize={14}>
              Service Notes
            </Text>
            <TextArea
              onChangeText={(text): void => {
                setServiceNotes({
                  notes: text,
                });
              }}
              fontSize={14}
              value={serviceNotes?.text}
              numberOfLines={5}
              mb={100}
              autoCompleteType={undefined}
            />
          </VStack>

          <FooterButton
            loading={jobStatusUiState === 'IN_PROGRESS'}
            label="MARK COMPLETED"
            type="DEFAULT"
            onPress={() => {
              dispatch(
                udpateJobStatusAsync({
                  images: serviceImages,
                  notes: serviceNotes,
                  status: 'COMPLETED',
                  orderId,
                  subOrderId,
                })
              ).then((response) => {
                const result: OrderStatus = response.payload;
                if (result.status === 'SUCCESS') {
                  setShowJobCompleted(false);
                  dispatch(
                    getOrderDetailsAsync({
                      orderId,
                      subOrderId,
                    })
                  );
                  dispatch(setRefreshNeeded({ data: { UPCOMING_SERVICES: true } }));
                } else {
                  setErrorMsg(result.message);
                }
              });
            }}
          />
        </VStack>
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </Actionsheet.Content>
    </Actionsheet>
  );
}

export default JobCompletedBottomSheet;
