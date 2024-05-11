"use client";
import { title, subtitle } from "@/components/primitives";
import { Divider } from "@nextui-org/divider";
import ItemList from "@/components/ItemList";
import { Code } from "@nextui-org/code";
import { useAppContext } from "./providers";
import { useEffect, useState } from "react";
import { getCart, get_user, logout } from "./actions";
import { useRouter } from "next/navigation";
export default function List() {
  const app = useAppContext();
  const router = useRouter();
  const [id, setId] = useState();

  useEffect(() => {
    const idd = app.user?._id || localStorage.getItem("user_id");
    console.log(idd);
    if (!idd) {
      logout();
    }
    setId(idd);
    getCart(idd).then((e) => {
      // console.log(e.result);
      app.setCart(e.result);
    });
  }, []);
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="  text-wrap max-w-xlg text-center justify-center">
          <h1 className={title({ color: "green" })}>welcome&nbsp;</h1>
          <br />
          <h4 className={title({ fullWidth: true })}>
            Experience personalized shopping with our innovative recommendation
            system.
          </h4>
          <br />
          <Code className=" text-wrap max-w-xlg" size="md">
            Select an item below to explore tailored recommendations powered by
            advanced machine learning.
          </Code>
        </div>
      </section>
      <Divider />
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
        <ItemList />
      </section>
    </>
  );
}
