import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const ZealIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon fill="#0dd" {...props} viewBox="0 0 29 29">
      <path
        d="M0 28.9575H28.9575V15.9266H5.7915C2.59294 15.9266 0 18.5196 0 21.7181V28.9575Z"
        fill="currentColor"
      ></path>
      <path
        d="M28.9575 0H0V13.0309H23.166C26.3646 13.0309 28.9575 10.4379 28.9575 7.23938V0Z"
        fill="currentColor"
      ></path>
    </SvgIcon>
  );
};
