"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Heart } from "react-feather";
import { useAppContext } from "@/app/providers";
import { addToCart } from "@/app/actions";
export default function Item({ item }) {
  const app = useAppContext();
  const user = app.user?._id || localStorage.getItem("user_id");
  const products = app.cart;
  const [isLoaded, setIsLoaded] = useState(true);
  const isItemIdInProducts = () => {
    return (
      Array.isArray(products) &&
      products.some((product) => product.item_id === item.id)
    );
  };
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(isItemIdInProducts());

  const clickAction = (id) => {
    // console.log("clicked", id);
    router.push(`/${id}`);
  };

  const clickAction2 = async () => {
    const newItemInCart = !isChecked; // Toggle isChecked
    setIsChecked(newItemInCart); // Update isChecked state immediately

    if (!isItemIdInProducts() && user && item.id) {
      console.log("mama we made it");
      const payload = {
        user: user,
        item: item.id,
      };

      const res2 = await addToCart(payload).then(() => {
        app.setCart([...products, item]); // Add new item to cart in app context
      });
    }
  };

  useEffect(() => {
    setIsChecked(isItemIdInProducts()); // Update isInCart based on products array
  }, [products]);

  return (
    <Card
      isPressable
      className="w-[240px] h-[300px] space-y-5 p-2"
      radius="lg"
      onClick={() => clickAction(item.id)}
    >
      <Skeleton
        className="rounded-lg"
        isLoaded={isLoaded}
        onload={() => setIsLoaded(true)}
      >
        <Image
          alt="Item Image"
          className=" h-[150px] object-cover  rounded-lg bg-default-300"
          src={item.image}
          width={230}
        />
      </Skeleton>
      <div className=" space-y-1 text-small pb-0 pt-2 px-4 flex-col items-start ">
        <Button isIconOnly className="bg-default-300" aria-label="Like">
          <Heart
            fill={isChecked ? "red" : "white"}
            color="none"
            onClick={() => clickAction2()}
          />
        </Button>
        <p className="text-tiny uppercase font-bold width={270} line-clamp-1">
          {item.title}
        </p>
        <small className="text-default-500 line-clamp-3">
          {item.description}
        </small>
      </div>
    </Card>
  );
}
