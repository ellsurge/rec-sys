import React, { useState } from "react";
import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";
import { useRouter } from "next/navigation";

export default function Item({ item }) {
  const [isLoaded, setIsLoaded] = useState(true);
  const router = useRouter();
  const clickAction = (id) => {
    
    // console.log("clicked", id);
    router.push(`/${id}`)
  };
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
