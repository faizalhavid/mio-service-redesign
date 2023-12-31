import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { AppColors } from "../../commons/colors";
import { ENV } from "../../commons/environment";

type GoogleMapsInputProps = {
  onSuccess: (value: any) => void;
  onFailure: (value: string) => void;
};

function GoogleMapsInput({
  onSuccess,
  onFailure,
}: GoogleMapsInputProps): JSX.Element {
  return (
    <GooglePlacesAutocomplete
      placeholder="Ex.: Street, City, State, Zip"
      fetchDetails
      onPress={(data, details: any = null) => {
        // console.log(JSON.stringify(details));
        const addressDetails: any[] = details.address_components;
        const _addressInfo: any = {};
        _addressInfo.formattedAddress = details.formatted_address;
        _addressInfo.googlePlaceId = details.place_id;
        try {
          _addressInfo.street =
            `${addressDetails.find((c) => c.types.indexOf("street_number") >= 0)
              .short_name 
            } ${ 
            addressDetails.find((c) => c.types.indexOf("route") >= 0)
              .short_name}`;
          _addressInfo.city = addressDetails.find(
            (c) => c.types.indexOf("locality") >= 0
          ).short_name;
          _addressInfo.state = addressDetails.find(
            (c) => c.types.indexOf("administrative_area_level_1") >= 0
          ).short_name;
          _addressInfo.zip = addressDetails.find(
            (c) => c.types.indexOf("postal_code") >= 0
          ).short_name;
          _addressInfo.location = {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          };
        } catch (error) {
          console.warn(error);
          onFailure("Something went wrong!");
        }
        onSuccess(_addressInfo);
      }}
      query={{
        key: ENV.GOOGLE_MAPS_API_KEY,
        language: "en",
        components: "country:us",
      }}
      textInputProps={{
        clearButtonMode: "always",
        placeholderTextColor: AppColors.AAA,
      }}
      styles={{
        textInputContainer: {
          borderBottomColor: AppColors.CCC,
          borderBottomWidth: 1,
          margin: 0,
          //   marginHorizontal: 10,
        },
        textInput: {
          margin: 0,
          color: AppColors.SECONDARY,
          // backgroundColor: "transparent",
        },
        predefinedPlacesDescription: {
          margin: 0,
        },
        description: { color: AppColors.SECONDARY },
      }}
      // suppressDefaultStyles={true}
      listUnderlayColor={AppColors.SECONDARY}
    />
  );
}

export default GoogleMapsInput;
