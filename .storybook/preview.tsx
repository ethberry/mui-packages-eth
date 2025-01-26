import { createBrowserRouter, RouterProvider } from "react-router";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { FormProvider, useForm } from "react-hook-form";
import { Preview } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import { ReduxProvider, createStore } from "../other/redux";

const decorators = [
  Story => {
    const router = createBrowserRouter([
      {
        path: "*",
        element: (
          <ReduxProvider store={createStore([])}>
            <ThemeProvider theme={createTheme()}>
              <StyledEngineProvider injectFirst>
                <CssBaseline />
                <FormProvider {...useForm()}>
                  <Story />
                </FormProvider>
              </StyledEngineProvider>
            </ThemeProvider>
          </ReduxProvider>
        ),
      },
    ]);

    return <RouterProvider router={router} />;
  },
];

const parameters = {
  actions: { argTypesRegex: "^on.*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
};

const preview: Preview = {
  decorators,
  parameters,
};

export default preview;
