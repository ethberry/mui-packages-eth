import { IntlProvider } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { constants } from "ethers";
import { Meta, StoryObj } from "@storybook/react";

import { TestIdProvider } from "@ethberry/provider-test-id";

import { EthInput } from "./index";

const i18n = {
  "form.labels.ethMask": "Eth",
  "form.placeholders.ethMask": "Enter amount",
};

export default {
  title: "MaskedInput/Eth",
  component: EthInput,
  decorators: [
    Story => (
      <IntlProvider locale="en" messages={i18n}>
        <TestIdProvider testId="eth">
          <FormProvider {...useForm({ defaultValues: { ethMask: constants.WeiPerEther.toString() } })}>
            <Story />
          </FormProvider>
        </TestIdProvider>
      </IntlProvider>
    ),
  ],
} as Meta<typeof EthInput>;

type Story = StoryObj<typeof EthInput>;

const Template: Story = {
  render: args => <EthInput {...args} />,
};

export const Simple = {
  ...Template,
  args: {
    name: "ethMask",
  },
};
