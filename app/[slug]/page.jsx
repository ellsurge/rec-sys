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
      if (i.result.length > 0) {
        setItem(i.result[0]);
        setRecommendations(i.result.slice(1));
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
      <div className="flex flex-wrap  justify-center mb-8  px-2 py-4">
        <small className="mb-4 mt-0 font-normal leading-normal">
          Our recommendation system works by turning each item, like a movie or
          product, into a set of numbers that capture its meaning and
          relationships to other items. GloVe (Global Vectors for Word
          Representation) is a tool that learns these number sets by looking at
          how often words appear together. In a recommendation system, this
          means items that are similar in meaning are placed close together. So,
          when you like or buy something, the system can suggest other items
          that are closely related, making recommendations more accurate and
          relevant to your interests.
        </small>
      </div>
      <Divider />

      {recommendations.length > 0 && (
        <div className=" inline-block text-center justify-center gap-10 mt-5">
          <div className="flex flex-wrap gap-10 justify-center">
            {recommendations.map((item) => (
              <Item
                key={item.item_id} // Assuming 'key' is a unique identifier for each item
                item={{
                  id: item.id,
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
