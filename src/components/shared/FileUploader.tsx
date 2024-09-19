import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChanged: (file: File[]) => void,
  mediaUrl:string
};

export default function FileUploader({ fieldChanged,mediaUrl }: FileUploaderProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChanged(acceptedFiles);
    setFileUrl(convertFileToUrl(acceptedFiles[0]));
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center cursor-pointer flex-col rounded-xl bg-dark-3">
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="w-full flex justify-center p-5 lg:p-10">
            <img src={fileUrl} alt="photo" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/public/assets/icons/file-upload.svg"
            alt="upload file"
            width={96}
            height={77}
          />
          <h3 className="base-medium mb-2 mt-6 text-light-2">
            Drag photo here
          </h3>
          <p className="small-regular mb-6 text-light-4">SVG, PNG, JPG</p>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
