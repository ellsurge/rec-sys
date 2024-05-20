"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { getAllItems, getCart, getItem } from "../actions";
import { Skeleton } from "@nextui-org/skeleton";
import { Image } from "@nextui-org/image";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Item from "@/components/Item";
import { useAppContext } from "../providers";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function List() {
  const app = useAppContext();
  const [id, setId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const cart = app.cart;
  const router = useRouter();

  useEffect(() => {
    const idd = app.user?._id || localStorage.getItem("user_id");
    console.log(idd);
    if (!idd) {
      logout();
    }
    setId(idd);
    getCart(idd).then((e) => {
      console.log(e.result);

      app.setCart(e.result);
    });
  }, []);
  return (
    <div className="gap-2">
      {Array.isArray(cart) &&
        cart.map((item) => (
          <div key={item.item_id} className="mb-8">
            {!isLoading ? (
              <div
                className="flex justify-center mb-4"
                onClick={() => {
                  router.push(`/${item.item_id}`);
                }}
              >
                <Card className="w-[300px]">
                  <Image src={item.image} height={"auto"} alt="img" />
                </Card>
                <Card className="w-[500px] space-y-2 p-5">
                  <p className="text-2xl uppercase font-bold">{item.name}</p>
                  <p className="text-xl text-default-500">{item.category}</p>
                </Card>
              </div>
            ) : (
              <Skeleton className="rounded-lg h-60" />
            )}
            {/* <Divider /> */}
          </div>
        ))}
    </div>
  );
}
