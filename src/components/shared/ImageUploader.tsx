import { convertFileToUrl } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";

type ImageUploaderProps = {
  fieldChanged: (file: File[]) => void;
  mediaUrl: string;
};

export default function ImageUploader({
  fieldChanged,
  mediaUrl,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChanged(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpeg", ".jpg"] },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="flex-center flex-col gap-5">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="h-28 w-28 cursor-pointer rounded-full object-cover lg:h-36 lg:w-36"
        />
        <p className="small-regular cursor-pointer text-light-3">
          Change profile photo
        </p>
      </div>
    </div>
  );
}
