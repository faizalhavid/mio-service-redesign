import {
  Actionsheet,
  Button,
  Circle,
  HStack,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import {
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceButton from "../../components/ServiceButton";
import { navigate } from "../../navigations/rootNavigation";
import { useMutation, useQuery } from "react-query";
import { getLead, getServices, postLead, putLead } from "../../services/order";
import { Service } from "../../commons/types";
import { useAuth } from "../../contexts/AuthContext";
import OrderSummary from "../../components/OrderSummary";

const LAWN_CARE_ID: string = "lawnCare";
const POOL_CLEANING_ID: string = "poolCleaning";
const HOUSE_CLEANING_ID: string = "houseCleaning";
const PEST_CONTROL_ID: string = "pestControl";

const LAWN_CARE_TEXT: string = "Lawn Care";
const POOL_CLEANING_TEXT: string = "Pool Cleaning";
const HOUSE_CLEANING_TEXT: string = "House Cleaning";
const PEST_CONTROL_TEXT: string = "Pest Control";

export type ServicesType = {
  id: string;
  icon: (color?: string) => string;
  text: string;
  description: string;
};

export const SERVICES: { [key: string]: ServicesType } = {
  [LAWN_CARE_ID]: {
    id: LAWN_CARE_ID,
    icon: (color: string = "white") => LAWN_CARE(color),
    text: LAWN_CARE_TEXT,
    description:
      "Give your lawn the boost it needs without all of the work. Our providers will bring the best out of your yard.",
  },
  [POOL_CLEANING_ID]: {
    id: POOL_CLEANING_ID,
    icon: (color: string = "white") => POOL_CLEANING(color),
    text: POOL_CLEANING_TEXT,
    description: "Let our providers do the work while you relax poolside",
  },
  [HOUSE_CLEANING_ID]: {
    id: HOUSE_CLEANING_ID,
    icon: (color: string = "white") => HOUSE_CLEANING(color),
    text: HOUSE_CLEANING_TEXT,
    description:
      "The weekends weren't made for house cleaning. Our cleaning providers will make sure your home shines",
  },
  [PEST_CONTROL_ID]: {
    id: PEST_CONTROL_ID,
    icon: (color: string = "white") => PEST_CONTROL(color),
    text: PEST_CONTROL_TEXT,
    description:
      "Don't let bugs creep you out. Get a pest control treatment today",
  },
};

const ChooseService = (): JSX.Element => {
  const [toggleServiceInfo, setToggleServiceInfo] = React.useState(false);

  const [selectedServiceInfo, setSelectedServiceInfo] =
    React.useState<ServicesType>();

  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const [summaryHeight, setSummaryHeight] = React.useState<number>(75);

  const [loading, setLoading] = React.useState(false);
  const { leadDetails, setLeadDetails } = useAuth();
  const [services, setServices] = React.useState<Service[]>([{} as Service]);

  // const getAllServices = useQuery(
  //   "getAllServices",
  //   () => {
  //     setLoading(true);
  //     return getServices();
  //   },
  //   {
  //     onSuccess: (data) => {
  //       setLoading(false);
  //       setServices(data.data);
  //     },
  //     onError: (err) => {
  //       setLoading(false);
  //       console.log(err);
  //     },
  //   }
  // );

  const getLeadMutation = useMutation(
    "getLeadById",
    (leadId: string) => {
      setLoading(true);
      return getLead(leadId);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setLeadDetails(data.data);
        let _selectedServices: string[] = [];
        data.data.subOrders.forEach((subOrder: any) => {
          _selectedServices.push(subOrder.serviceId);
        });
        setSelectedServices(_selectedServices);
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const fetchLead = React.useCallback(async () => {
    let leadId = await AsyncStorage.getItem("LEAD_ID");
    if (leadId) {
      await getLeadMutation.mutateAsync(leadId);
    }
  }, []);

  React.useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const createLeadMutation = useMutation(
    "createLead",
    (data) => {
      setLoading(true);
      let payload = {
        subOrders: [
          ...selectedServices.map((service) => {
            return { serviceId: service };
          }),
        ],
      };
      return postLead(payload);
    },
    {
      onSuccess: async (data) => {
        setLoading(false);
        setLeadDetails(data.data);
        await AsyncStorage.setItem("LEAD_ID", data.data.leadId);
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const updateLeadMutation = useMutation(
    "updateLead",
    (data) => {
      setLoading(true);
      let existingServices = leadDetails.subOrders.map(
        (subOrder) => subOrder.serviceId
      );
      let filteredServices = selectedServices.filter(
        (serviceId) => !existingServices.includes(serviceId)
      );
      let payload = {
        ...leadDetails,
        subOrders: [
          ...leadDetails.subOrders,
          ...filteredServices.map((service) => {
            return { serviceId: service };
          }),
        ],
      };
      return putLead(payload);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setLeadDetails(data.data);
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const chooseService = (serviceName: string = "") => {
    let pos = selectedServices.indexOf(serviceName);
    if (~pos) {
      selectedServices.splice(pos, 1);
      setSelectedServices([...selectedServices]);
      return;
    }
    setSelectedServices([...selectedServices, serviceName]);
  };

  const showServiceInfo = (serviceName: string) => {
    setSelectedServiceInfo(SERVICES[serviceName]);
    setToggleServiceInfo(true);
  };

  const content = (
    <>
      <VStack mt={5} space={5}>
        <Text textAlign={"center"} fontSize={20}>
          Which services are {"\n"} you interested in?
        </Text>
        <VStack space={0}>
          <HStack justifyContent="center" space={5}>
            {[SERVICES[LAWN_CARE_ID], SERVICES[POOL_CLEANING_ID]].map(
              (service, index) => (
                <ServiceButton
                  key={index}
                  icon={service?.icon()}
                  text={service?.text}
                  status={selectedServices.indexOf(service?.id) >= 0}
                  onAdd={() => chooseService(service?.id)}
                  onPress={() => showServiceInfo(service?.id)}
                />
              )
            )}
          </HStack>
          <HStack justifyContent="center" space={5}>
            {[SERVICES[HOUSE_CLEANING_ID], SERVICES[PEST_CONTROL_ID]].map(
              (service, index) => (
                <ServiceButton
                  key={index}
                  icon={service?.icon()}
                  text={service?.text}
                  status={selectedServices.indexOf(service?.id) >= 0}
                  onAdd={() => chooseService(service?.id)}
                  onPress={() => showServiceInfo(service?.id)}
                />
              )
            )}
          </HStack>
        </VStack>
      </VStack>
      {/* <OrderSummary selectedServices={selectedServices} /> */}
      <Actionsheet
        isOpen={toggleServiceInfo}
        onClose={() => setToggleServiceInfo(false)}
      >
        <Actionsheet.Content>
          <HStack justifyContent="center" space={5}>
            <VStack space="5" p={10}>
              <View alignSelf={"center"}>
                {selectedServiceInfo?.icon && (
                  <Circle size={120} bg={AppColors.PRIMARY} p={10}>
                    <SvgCss xml={selectedServiceInfo?.icon()} />
                  </Circle>
                )}
              </View>
              <Text
                textAlign={"center"}
                color={AppColors.SECONDARY}
                fontWeight={"bold"}
                fontSize={16}
              >
                {selectedServiceInfo?.text}
              </Text>
              <Text
                textAlign={"center"}
                fontSize={14}
                color={AppColors.SECONDARY}
              >
                {selectedServiceInfo?.description}
              </Text>
              <Button
                mt={5}
                bg={AppColors.DARK_PRIMARY}
                borderColor={AppColors.DARK_PRIMARY}
                borderRadius={50}
                width={"100%"}
                height={50}
                onPress={() => {
                  chooseService(selectedServiceInfo?.text);
                  setToggleServiceInfo(false);
                }}
                _text={{
                  color: "white",
                }}
                alignSelf={"center"}
                _pressed={{
                  backgroundColor: `${AppColors.DARK_PRIMARY}E6`,
                }}
              >
                Add
              </Button>
            </VStack>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
      <FooterButton
        label="ADD SERVICE DETAILS"
        disabled={selectedServices.length === 0}
        subText="Please add required services"
        onPress={async () => {
          const leadId = await AsyncStorage.getItem("LEAD_ID");
          if (!leadId) {
            await createLeadMutation.mutateAsync();
          } else {
            await updateLeadMutation.mutateAsync();
          }
          navigate("ServiceDetails");
        }}
      />
    </>
  );
  return <AppSafeAreaView loading={loading}>{content}</AppSafeAreaView>;
};

export default ChooseService;
