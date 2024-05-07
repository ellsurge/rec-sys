"use client"; 
import { title, subtitle } from "@/components/primitives";
import { Divider } from "@nextui-org/divider";
import  ItemList  from "@/components/ItemList";
import { Code } from "@nextui-org/code";
export default function Home() {
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
