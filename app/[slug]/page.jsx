"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { getAllItems, getItem } from "../actions";
import { Skeleton } from "@nextui-org/skeleton";
import { Image } from "@nextui-org/image";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Item from "@/components/Item";

export default function ViewItem({ params }) {
  const id = params.slug;
  const [item, setItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getItem(id).then((i) => {
      if (i.length > 0) {
        setItem(i[0]);
        setRecommendations(i.slice(1));
        setIsLoading(true);
      }
    });
  }, []);
  return (
    <div className="gap-2">
      {!isLoading && (
        <Skeleton isLoaded={isLoading} className="rounded-lg h-60"></Skeleton>
      )}
      {isLoading && (
        <div className="flex flex-wrap  justify-center mb-8  border border-default-200 dark:border-default-100 px-2 py-4 rounded-lg">
          <Card className="w-[300px] " shadow="none" radius="none">
            <Image src={item?.image} height={"auto"} alt="img" />
          </Card>

          <Card className="w-[500px] space-y-2 p-5" shadow="none" radius="none">
            <p class="text-5xl  uppercase font-bold ">{item?.name}</p>
            <div className="inline-bock"></div>
            <p class="block text-xl text-default-500 ">{item?.category}</p>
          </Card>
        </div>
      )}
      <Divider />
      {recommendations.length > 0 && (
        <div className=" inline-block text-center justify-center gap-10 mt-5">
          <div className="flex flex-wrap gap-10 justify-center">
            {recommendations.map((item) => (
              <Item
                key={item.item_id} // Assuming 'key' is a unique identifier for each item
                item={{
                  id: item.item_id,
                  title: item.name,
                  image: item.image,
                  // category: item.category,
                  description: item.category,
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-10 justify-center pt-10"></div>
        </div>
      )}
    </div>
  );
}
