import {
  Button,
  Center,
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ChooseServiceDetailsButton from "../../components/ChooseServiceDetailsButton";
import FooterButton from "../../components/FooterButton";
import ServiceDetailsSection from "../../components/ServiceDetailsSection";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../navigations/rootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "react-query";
import { getCustomer } from "../../services/customer";
import { SERVICES } from "./ChooseService";
import { getLead } from "../../services/order";
import { SubOrder } from "../../commons/types";
import { SvgCss } from "react-native-svg";
import {
  CALENDAR_ICON,
  CHAT_OUTLINE_ICON,
  CIRCLE_TICK_ICON,
  INFO_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { getReadableDateTime } from "../../services/utils";

const ServiceDetails = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const { leadDetails, customerProfile } = useAuth();

  const [groupedLeadDetails, setGroupedLeadDetails] = useState<{
    [key: string]: SubOrder;
  }>({});

  React.useEffect(() => {
    if (!leadDetails) {
      return;
    }
    let details: { [key: string]: SubOrder } = {};
    leadDetails.subOrders.forEach((subOrder) => {
      details[subOrder.serviceId] = subOrder;
    });

    setGroupedLeadDetails(details);
  }, [leadDetails]);

  return (
    <AppSafeAreaView loading={loading}>
      <ScrollView>
        <VStack space={5}>
          <Text textAlign={"center"} fontSize={18}>
            Let's make sure {"\n"} we've got the right place
          </Text>
          <HStack
            justifyContent={"space-around"}
            alignItems={"center"}
            bg={"amber.300"}
            py={3}
          >
            {customerProfile?.addresses &&
              customerProfile?.addresses.length > 0 && (
                <Text>
                  {customerProfile?.addresses[0]?.street} {"\n"}
                  {customerProfile?.addresses[0]?.city},{" "}
                  {customerProfile?.addresses[0]?.state}{" "}
                  {customerProfile?.addresses[0]?.zip}
                </Text>
              )}
            <Button
              bg="white"
              borderWidth={0}
              height={8}
              variant={"outline"}
              borderRadius={25}
              size={"xs"}
              onPress={() =>
                navigate("Address", { returnTo: "ServiceDetails" })
              }
            >
              <Text color={"black"} fontSize={10}>
                CHANGE ADDRESS
              </Text>
            </Button>
          </HStack>
          <Center>
            <Text fontWeight={"semibold"} fontSize={14}>
              Please confirm the information below
            </Text>
          </Center>
          <VStack space={1}>
            {leadDetails?.subOrders?.map((lead, index) => {
              return (
                <ServiceDetailsSection
                  key={index}
                  title={SERVICES[lead.serviceId].text}
                  showEdit={
                    groupedLeadDetails[lead.serviceId]?.appointmentInfo
                      ?.providerProfile?.eaProviderId
                  }
                  onEdit={() => {
                    navigate("EditServiceDetails", {
                      serviceId: lead.serviceId,
                      mode: "UPDATE",
                    });
                  }}
                >
                  {groupedLeadDetails[lead.serviceId]?.appointmentInfo
                    ?.providerProfile?.eaProviderId ? (
                    <>
                      <VStack
                        my={1}
                        mx={1}
                        space={2}
                        borderWidth={1}
                        py={3}
                        borderRadius={10}
                        borderColor={AppColors.PRIMARY}
                      >
                        {lead.serviceId === "lawnCare" && (
                          <HStack space={2} alignItems={"center"} pl={3}>
                            <SvgCss xml={INFO_ICON} width={20} height={20} />
                            <Text color={AppColors.SECONDARY} fontSize={14}>
                              {groupedLeadDetails[lead.serviceId].area +
                                " Sq. Ft."}
                            </Text>
                          </HStack>
                        )}
                        {lead.serviceId === "houseCleaning" && (
                          <HStack space={2} alignItems={"center"} pl={3}>
                            <SvgCss xml={INFO_ICON} width={20} height={20} />
                            <Text color={AppColors.SECONDARY} fontSize={14}>
                              Bedroom -{" "}
                              {groupedLeadDetails[lead.serviceId].bedrooms} |
                              Bathrooms -{" "}
                              {groupedLeadDetails[lead.serviceId].bathrooms}
                            </Text>
                          </HStack>
                        )}
                        <HStack space={2} alignItems={"center"} pl={3}>
                          <SvgCss
                            xml={CIRCLE_TICK_ICON}
                            width={20}
                            height={20}
                          />
                          <Text color={AppColors.SECONDARY} fontSize={14}>
                            $
                            {
                              groupedLeadDetails[lead.serviceId]?.servicePrice
                                .cost
                            }{" "}
                            <Text textTransform={"capitalize"}>
                              {
                                groupedLeadDetails[lead.serviceId]?.flags
                                  ?.recurringDuration
                              }
                              {groupedLeadDetails[lead.serviceId]?.flags
                                ?.isRecurring
                                ? " - Recurring"
                                : ""}
                            </Text>
                          </Text>
                        </HStack>
                        <HStack space={2} alignItems={"center"} pl={3}>
                          <SvgCss xml={CALENDAR_ICON} width={20} height={20} />
                          <Text color={AppColors.SECONDARY} fontSize={14}>
                            {
                              getReadableDateTime(
                                groupedLeadDetails[lead.serviceId]
                                  ?.appointmentInfo?.appointmentDateTime
                              ).all
                            }
                          </Text>
                        </HStack>
                        <HStack space={2} alignItems={"center"} pl={3}>
                          <SvgCss
                            xml={CHAT_OUTLINE_ICON(AppColors.SECONDARY)}
                            width={20}
                            height={20}
                          />
                          <Text color={AppColors.SECONDARY} fontSize={14}>
                            {groupedLeadDetails[lead.serviceId]
                              ?.serviceNotes[0] || "-"}
                          </Text>
                        </HStack>
                      </VStack>
                    </>
                  ) : (
                    <>
                      {["lawnCare", "houseCleaning"].includes(
                        lead.serviceId
                      ) && (
                        <>
                          <VStack
                            my={1}
                            mx={1}
                            space={2}
                            borderWidth={1}
                            py={3}
                            borderRadius={10}
                            borderColor={AppColors.PRIMARY}
                          >
                            {lead.serviceId === "lawnCare" && (
                              <HStack space={2} alignItems={"center"} pl={3}>
                                <SvgCss
                                  xml={INFO_ICON}
                                  width={20}
                                  height={20}
                                />
                                <Text color={AppColors.SECONDARY} fontSize={14}>
                                  {groupedLeadDetails[lead.serviceId]?.area +
                                    " Sq. Ft."}
                                </Text>
                              </HStack>
                            )}
                            {lead.serviceId === "houseCleaning" && (
                              <HStack space={2} alignItems={"center"} pl={3}>
                                <SvgCss
                                  xml={INFO_ICON}
                                  width={20}
                                  height={20}
                                />
                                <Text color={AppColors.SECONDARY} fontSize={14}>
                                  Bedroom -{" "}
                                  {groupedLeadDetails[lead.serviceId]?.bedrooms}{" "}
                                  | Bathrooms -{" "}
                                  {
                                    groupedLeadDetails[lead.serviceId]
                                      ?.bathrooms
                                  }
                                </Text>
                              </HStack>
                            )}
                          </VStack>
                          <Divider thickness={0} my={1} />
                        </>
                      )}

                      <ChooseServiceDetailsButton
                        title="Choose Subscription & Schedule"
                        onPress={() => {
                          navigate("EditServiceDetails", {
                            serviceId: lead.serviceId,
                          });
                        }}
                      />
                    </>
                  )}
                </ServiceDetailsSection>
              );
            })}

            {/*   */}
          </VStack>
          {/* <Divider thickness={10} /> */}
          {/* <PriceBreakdown /> */}
          <Divider thickness={0} mt={0} mb={200} />
        </VStack>
      </ScrollView>
      {/* <OrderSummary selectedServices={selectedServices} /> */}
      <FooterButton
        v2={false}
        label="CHOOSE PAYMENT METHOD"
        subText="Provide payment information in next step"
        onPress={() => navigate("Payment")}
      />
    </AppSafeAreaView>
  );
};

export default ServiceDetails;
