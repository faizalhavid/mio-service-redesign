import { CheckIcon, Select } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type ServiceDetailsOptionsProps = {
  title: string;
};

const ServiceDetailsOptions = ({
  title,
}: ServiceDetailsOptionsProps): JSX.Element => {
  return (
    <>
      <Select
        minWidth="200"
        placeholder={title}
        _selectedItem={{
          bg: AppColors.PRIMARY,
          endIcon: <CheckIcon size="5" />,
        }}
        variant="underlined"
      >
        <Select.Item label="UX Research" value="ux" />
        <Select.Item label="Web Development" value="web" />
        <Select.Item label="Cross Platform Development" value="cross" />
        <Select.Item label="UI Designing" value="ui" />
        <Select.Item label="Backend Development" value="backend" />
      </Select>
    </>
  );
};

export default ServiceDetailsOptions;
