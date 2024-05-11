"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getAllItems } from "@/app/actions";
import Item from "@/components/Item"; // Assuming correct import path for Item component
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Pagination } from "@nextui-org/pagination";

const ItemList = () => {
  const [status, setStatus] = useState("idle");
  const [items, setItems] = useState([]);
  // const[data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemPerPage = 8;
  const pages = Math.ceil(items.length / itemPerPage);
  const data = useMemo(() => {
    const start = (currentPage - 1) * itemPerPage;
    const end = start + itemPerPage;

    return items.slice(start, end);
  }, [currentPage, items]);

  const reloadAction = async () => {
    setStatus("loading");
    try {
      const response = await getAllItems();
      console.log(response);
      if (response.result && response.result.length > 0) {
        setItems(response.result);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setStatus("idle");
    }
  };
  useEffect(() => {
    reloadAction();
  }, []);
  const IdleComponent = () => (
    <div className="inline-block text-center justify-center">
      <Card shadow="none" className="w-100">
        <CardBody className="text-center justify-center">
          <Image
            src="/noun-tired-cat.svg" // Adjust the image path as needed
            alt="Bored Cat"
            width={300}
            height={"100%"}
          />
          <p className="pb-2">So much nothing :(</p>
          <Button
            variant="flat"
            size="md"
            isLoading={status === "loading"}
            onClick={reloadAction}
            fullWidth={false}
          >
            Reload Page
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <>
      {items.length === 0 && <IdleComponent />}
      {items.length > 0 && (
        <div className=" inline-block text-center justify-center gap-10 p-10">
          <div className="flex flex-wrap gap-10 justify-center">
            {data.map((item) => (
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
          <div className="flex flex-wrap gap-10 justify-center pt-10">
            <Pagination
              color="success"
              showControls
              total={pages}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ItemList;
