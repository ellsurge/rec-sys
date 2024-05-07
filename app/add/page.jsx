"use client";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input, Textarea } from "@nextui-org/input";
import { useS3Upload } from "next-s3-upload";
import { useMemo, useState } from "react";
import { addItem } from "../actions";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState();
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [desc, setDisc] = useState();
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const isInvalid = useMemo(() => {
    let val = [false, false, false];
    if (title == "") val[0] = true;
    if (desc == "") val[1] = true;
    if (title !== "") val[0] = false;
    if (desc !== "") val[1] = false;

    return val;
  }, [title, imgUrl, desc]);

  const handleFileChange = async (file) => {
    setLoadingImg(true);
    const { url } = await uploadToS3(file);
    setImgUrl(url);
    setLoadingImg(false);

  };
  const submitAction = () => {
    if (
      !isInvalid[0] &&
      !isInvalid[1] &&
      imgUrl !== undefined &&
      title !== undefined &&
      desc !== undefined
    ) {
      setLoading(true);
      const payload = {
        name: title,
        category: desc,
        image: imgUrl,
      };
      addItem(payload).then(() => {
        setLoading(false);
        router.push('/');
      }
      ).catch(() => {
        console.log("error sending data");
      setLoading(false);
        
        
      })
      console.log(payload);
    } 
  };
  return (
    <div>
      <div className="relative  flex flex-col items-center border border-default-200 dark:border-default-100 px-2 py-4 rounded-lg">
        <div className=" py-4 px-2 w-full">
          <Input
            isInvalid={isInvalid[0]}
            color={isInvalid[0] ? "danger" : "default"}
            errorMessage={isInvalid[0] && "cannot be empty"}
            isRequired
            type="text"
            label="Title"
            placeholder="enter product title"
            onValueChange={(e) => setTitle(e)}
          />
        </div>
        <div className=" pb-4 px-2 w-full">
          <Textarea
            isInvalid={isInvalid[1]}
            color={isInvalid[1] ? "danger" : "default"}
            errorMessage={isInvalid[1] && "cannot be empty"}
            isRequired
            label="Description"
            placeholder="Enter your description"
            onValueChange={(e) => setDisc(e)}
          />
        </div>

        <div class=" pb-4 flex items-center justify-center w-full">
          {imgUrl && <Image src={imgUrl} alt="" className="h-[200px]" />}
          {!imgUrl && (
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              {" "}
              {loadingImg && "getting image..."}
              <div
                class="flex flex-col items-center justify-center pt-5 pb-6"
                onClick={openFileDialog}
              >
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG or JPG (MAX. 800x400px)
                </p>
              </div>
              <FileInput onChange={handleFileChange} />
            </label>
          )}
        </div>

        <div className=" px-2 w-full">
          <Button
            isLoading={loading}
            color="primary"
            type="flat"
            onClick={submitAction}
          >
            {" "}
            Submit{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
