"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useContext } from "react";
import { getCart, get_user } from "./actions";

export const AppContext = createContext();

export function AppWrapper({ children }) {
  const [user, setUser] = React.useState();
  const [cart, setCart] = React.useState([]);

  let sharedState = {
    user,
    setUser,
    value: 42,
    cart,
    setCart,
  };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}
export function useAppContext() {
  return useContext(AppContext);
}

export function Providers({ children, themeProps }) {
  const router = useRouter();
  return (
    <AppWrapper>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </AppWrapper>
  );
}
