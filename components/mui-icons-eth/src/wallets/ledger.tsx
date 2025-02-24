import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const LedgerIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <circle cx="30" cy="30" r="30" fill="#DFF1FE" />
      <path
        d="M34.2955 42.2998V43.9996H46V36.3334H44.2945V42.2998H34.2955ZM34.2955 17V18.6998H44.2945V24.6666H46V17H34.2955ZM27.4268 24.6666H25.7214V36.333H33.4129V34.7998H27.4268V24.6666ZM14 36.3334V44H25.7044V42.2998H15.7054V36.3334H14ZM14 17V24.6666H15.7054V18.6998H25.7044V17H14Z"
        fill="black"
      />
    </SvgIcon>
  );
};
