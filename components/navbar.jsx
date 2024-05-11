"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon, SearchIcon, Logo } from "@/components/icons";
import { get_user, logout } from "@/app/actions";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/app/providers";
import { Badge } from "@nextui-org/badge";
import { Archive } from "react-feather";
import { useEffect } from "react";

export const Navbar = () => {
  const route = usePathname();
  const has = ["/login", "/signup"].includes(route);
  const router = useRouter();
  const app = useAppContext();
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );
  const Logout = !has && (
    <Button
      onClick={() => logout()}
      className="text-sm font-normal text-default-600 bg-default-100"
      variant="flat"
    >
      logout
    </Button>
  );

  const Add = !has && (
    <Button
      as={NextLink}
      className="text-sm font-normal text-default-600 bg-default-100"
      href="/add"
      startContent={<HeartFilledIcon className="text-primary" />}
      variant="flat"
    >
      Add Item
    </Button>
  );
  // console.log(app.cart);
  const Cart = app.cart && (
    <Badge
      content={app.cart.length}
      shape="circle"
      color="danger"
      className="ml-2"
    >
      <Button isIconOnly as={NextLink} href="/list" variant="light">
        <Archive height={25} className="bg-default-100" />
      </Button>
    </Badge>
  );
  // useEffect(() => {}, [app.cart]);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">RECOMMENDATION SYSTEM</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">
          <ThemeSwitch />
          {Cart}
        </NavbarItem>
        <NavbarItem className="hidden md:flex">{Add}</NavbarItem>
        <NavbarItem className="hidden md:flex">{Logout}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        {Cart}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {Add}
        {Logout}
      </NavbarMenu>
    </NextUINavbar>
  );
};
