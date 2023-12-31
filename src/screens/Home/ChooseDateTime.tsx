import { firebase } from '@react-native-firebase/storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, HStack, Image, Pressable, Text, TextArea, Toast, VStack } from 'native-base';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SvgCss } from 'react-native-svg';
import { PLUS_ICON } from '../../commons/assets';
import { AppColors } from '../../commons/colors';
import { SubOrder } from '../../commons/types';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import FooterButton from '../../components/FooterButton';
import VirtualizedView from '../../components/VirtualizedView';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { SuperRootStackParamList } from '../../navigations';
import { goBack } from '../../navigations/rootNavigation';
import { selectCustomer } from '../../slices/customer-slice';
import { selectLead, updateLeadAsync } from '../../slices/lead-slice';

export type AppointmentDateOptionType = {
  fullDate: string;
  date: number;
  day: string;
  month: string;
  selected: boolean;
};

export type AppointmentTimeOptionType = {
  actualMin: string;
  rangeMin: string;
  rangeMax: string;
  minMeridian: string;
  maxMaxidian: string;
  selected: boolean;
};

export const MONTH = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const FULL_MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ChooseDateTimeProps = NativeStackScreenProps<SuperRootStackParamList, 'ChooseDateTime'>;

function ChooseDateTime({ route }: ChooseDateTimeProps): JSX.Element {
  const columns = 2;
  const dispatch = useAppDispatch();
  const { mode, serviceId } = route.params;
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceNotes, setServiceNotes] = React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [appointmentDateOptions, setAppointmentDateOptions] = useState<AppointmentDateOptionType[]>(
    []
  );
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<AppointmentTimeOptionType[]>(
    []
  );

  const [serviceImages, setServiceImages] = useState<string[]>([]);

  const { member: leadDetails, uiState: leadDetailsUiState } = useAppSelector(selectLead);

  const { member: customer } = useAppSelector(selectCustomer);

  const updateLead = async () => {
    const _leadDetails = {
      ...leadDetails,
    };
    const updatedSuborders = _leadDetails?.subOrders?.map((subOrder) => {
      if (subOrder.serviceId === serviceId) {
        let selecDate = selectedDate;
        if (Platform.OS === 'ios') {
          selecDate = selecDate.replace(/-/g, '/');
        }

        subOrder = {
          ...subOrder,
          appointmentInfo: {
            ...subOrder.appointmentInfo,
            appointmentDateTime: new Date(
              `${selecDate} ${parseInt(selectedTime) > 9 ? selectedTime : `0${selectedTime}`}:00:00`
            ).toISOString(),
          },
          serviceNotes: [
            {
              notes: serviceNotes,
              email: customer.customerId,
              status: 'SCHEDULED',
              timestamp: new Date().toISOString(),
              userType: 'customer',
              serviceImages: serviceImages || [],
            },
          ],
        };

        if (appointmentTimeOptions) {
          for (const option of appointmentTimeOptions) {
            if (option.selected) {
              subOrder.appointmentInfo.selectedRange = {
                rangeStart: `${option.rangeMin} ${option.minMeridian}`,
                rangeEnd: `${option.rangeMax} ${option.maxMaxidian}`,
              };
            }
          }
        }
        subOrder.serviceImages = serviceImages;
      }
      return subOrder;
    });
    const payload = {
      ..._leadDetails,
      subOrders: updatedSuborders,
    };

    return dispatch(updateLeadAsync(payload));
    // return putLead(payload);
  };

  React.useEffect(() => {
    const isUpdate = mode === 'UPDATE';
    let subOrder = {} as SubOrder;
    if (isUpdate) {
      subOrder = leadDetails.subOrders.filter((so) => so.serviceId === serviceId)[0];
    }
    if (isUpdate) {
      setServiceNotes(subOrder?.serviceNotes?.[0]?.notes || '');
      setServiceImages(subOrder?.serviceNotes?.[0]?.serviceImages || []);
    }

    const dates: AppointmentDateOptionType[] = [];
    [7, 8, 9, 10].forEach((number) => {
      const date = new Date();
      date.setDate(date.getDate() + number);
      const month = date.getMonth() + 1;
      const numberDate = date.getDate();
      const fullDate = `${date.getFullYear()}-${month > 9 ? month : `0${month}`}-${
        numberDate > 9 ? numberDate : `0${numberDate}`
      }`;
      let isSelected = false;
      if (isUpdate) {
        isSelected =
          date.getDate() === new Date(subOrder.appointmentInfo.appointmentDateTime).getDate();
        if (isSelected) {
          setSelectedDate(fullDate);
        }
      }
      dates.push({
        fullDate,
        date: date.getDate(),
        day: DAY[date.getDay()],
        month: MONTH[date.getMonth()],
        selected: isSelected,
      });
    });
    setAppointmentDateOptions(dates);
    const times: AppointmentTimeOptionType[] = [];
    [8, 10, 12, 14].forEach((number) => {
      const rangeMin = `${number > 12 ? number - 12 : number}`;
      const actualMin = `${number}`;
      let isSelected = false;
      if (isUpdate) {
        isSelected =
          parseInt(actualMin) === new Date(subOrder.appointmentInfo.appointmentDateTime).getHours();
        if (isSelected) {
          setSelectedTime(actualMin);
        }
      }
      times.push({
        actualMin,
        rangeMin,
        rangeMax: `${number + 4 > 12 ? number + 4 - 12 : number + 4}`,
        minMeridian: `${number >= 12 ? 'PM' : 'AM'}`,
        maxMaxidian: `${number + 4 >= 12 ? 'PM' : 'AM'}`,
        selected: isSelected,
      });
    });
    setAppointmentTimeOptions(times);
  }, [mode]);

  return (
    <AppSafeAreaView loading={leadDetailsUiState === 'IN_PROGRESS' || loading}>
      <VirtualizedView>
        <KeyboardAwareScrollView enableOnAndroid>
          <VStack space={5} pt={5}>
            <Text textAlign="center" fontWeight="semibold" fontSize={18}>
              Choose Date
            </Text>
            <HStack justifyContent="center" alignContent="center" space={0} bg="#eee" p={3}>
              <FlatList
                data={appointmentDateOptions}
                horizontal
                contentContainerStyle={{
                  width: '100%',
                }}
                renderItem={({ index, item }) => (
                  <Pressable
                    key={index}
                    height={20}
                    borderRadius={5}
                    width={78}
                    mr={2}
                    p={2}
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={item.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
                    bg={item.selected ? AppColors.LIGHT_TEAL : '#fff'}
                    _pressed={{
                      borderColor: AppColors.TEAL,
                      borderWidth: 1,
                      backgroundColor: AppColors.LIGHT_TEAL,
                    }}
                    onPress={() => {
                      const updatedAppointmentDateOptions = appointmentDateOptions.map(
                        (option, optionIndex) => {
                          if (optionIndex === index) {
                            setSelectedDate(option.fullDate);
                            return {
                              ...option,
                              selected: true,
                            };
                          }
                          return { ...option, selected: false };
                        }
                      );
                      setAppointmentDateOptions(updatedAppointmentDateOptions);
                    }}
                  >
                    <Text
                      alignSelf="center"
                      color={AppColors.TEAL}
                      fontWeight="semibold"
                      textAlign="center"
                    >
                      {item.day} {'\n'} {item.month} {item.date}
                    </Text>
                  </Pressable>
                )}
              />
            </HStack>
            <Text textAlign="center" fontWeight="semibold" fontSize={18}>
              Choose Slot
            </Text>
            <HStack justifyContent="center" alignItems="center" space={0} bg="#eee" p={3}>
              <FlatList
                data={appointmentTimeOptions}
                numColumns={columns}
                contentContainerStyle={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
                renderItem={({ index, item }) => (
                  <Pressable
                    key={index}
                    height={10}
                    borderRadius={5}
                    width="48%"
                    m={1}
                    justifyContent="center"
                    p={2}
                    borderWidth={item.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
                    bg={item.selected ? AppColors.LIGHT_TEAL : '#fff'}
                    _pressed={{
                      borderColor: AppColors.TEAL,
                      borderWidth: 1,
                      backgroundColor: AppColors.LIGHT_TEAL,
                    }}
                    onPress={() => {
                      const updatedAppointmentTimeOptions = appointmentTimeOptions.map(
                        (option, optionIndex) => {
                          if (optionIndex === index) {
                            setSelectedTime(option.actualMin);
                            return {
                              ...option,
                              selected: true,
                            };
                          }
                          return { ...option, selected: false };
                        }
                      );
                      setAppointmentTimeOptions(updatedAppointmentTimeOptions);
                    }}
                  >
                    <Text alignSelf="center" color={AppColors.TEAL} fontWeight="semibold">
                      {`${item.rangeMin} ${item.minMeridian} - ${item.rangeMax} ${item.maxMaxidian}`}
                    </Text>
                  </Pressable>
                )}
              />
            </HStack>
            <Text textAlign="center" fontWeight="semibold" fontSize={18}>
              Choose Property Images{' '}
              <Text color={AppColors.AAA} fontSize={14}>
                (Optional)
              </Text>
            </Text>
            <HStack justifyContent="center" alignItems="center" space={2} bg="#eee" p={3}>
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
                        const uploadFilename = `${leadDetails.leadId}/${
                          leadDetails.leadId
                        }-${serviceId}-${new Date().getTime()}`;
                        const imageRef = `leads/${uploadFilename}.${fileName.split('.')[1]}`;

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
                <SvgCss width={20} height={20} xml={PLUS_ICON(AppColors.TEAL)} />
              </Pressable>
            </HStack>
            <Text textAlign="center" fontWeight="semibold" fontSize={18}>
              Service Notes{' '}
              <Text color={AppColors.AAA} fontSize={14}>
                (Optional)
              </Text>
            </Text>
            <TextArea
              mx={3}
              onChangeText={(text): void => {
                setServiceNotes(text);
              }}
              fontSize={14}
              value={serviceNotes}
              numberOfLines={5}
              mb={100}
              keyboardType="default"
              returnKeyType="done"
              blurOnSubmit
              autoCompleteType={undefined}
            />
          </VStack>
        </KeyboardAwareScrollView>
      </VirtualizedView>
      <FooterButton
        type="DATETIME_SELECTION"
        label="DONE"
        serviceId={serviceId}
        disabled={!selectedDate || !selectedTime}
        loading={leadDetailsUiState === 'IN_PROGRESS'}
        onPress={async () => {
          await updateLead();
          goBack();
        }}
      />
    </AppSafeAreaView>
  );
}

export default ChooseDateTime;
