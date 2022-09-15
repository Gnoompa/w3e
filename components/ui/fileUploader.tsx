import { useCallback, useEffect, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { Flex, Box, Container, Text, Button, Image } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

type FileUploaderProps = {
  placeholder?: string | JSX.Element;
  value?: Array<Blob>;
  config?: DropzoneOptions;
  onChange?: (files: Array<Blob>) => any;
};

export const FileUploader = (props: FileUploaderProps) => {
  const [files, setFiles] = useState<Array<Blob> | undefined>(
    props.value || undefined
  );
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    files && props.onChange?.(files);

    setPreview(
      files && files.length == 1 && files[0].type.match(/image|video/)
        ? URL.createObjectURL(files[0])
        : undefined
    );
  }, [files]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    ...props.config,
  });

  const removeFile = (file: Blob) => () => {
    const newFiles = [...files!];

    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const removeAll = () => {
    setFiles([]);
  };

  return (
    <Flex sx={{ flexDirection: "column" }} gap={".5rem"}>
      <Container
        variant="fileUploader"
        {...getRootProps()}
        bg={files?.length ? "bg" : "bgAccent"}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Image
            src={preview}
            width="100%"
            height="100%"
            objectFit="contain"
            alt="uploaded image"
            p={".5rem"}
          ></Image>
        ) : (
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            {files && files.length > 1 ? (
              <Text mt=".5rem" variant="hint">
                ({files.length}) files
              </Text>
            ) : (
              props.placeholder && (
                <Text
                  color={"textContrastSecondary"}
                  mt={["-2rem", 0]}
                  textAlign={["center", "center", "center", "initial"]}
                  lineHeight={"2.5rem"}
                >
                  {props.placeholder}
                </Text>
              )
            )}
          </Flex>
        )}
        {files && !files.length && (
          <Text
            pos={"absolute"}
            bottom=".5rem"
            fontSize={"sm"}
            opacity={".7"}
            color={"textContrastSecondary"}
            textAlign={["center", "center", "center", "initial"]}
          >
            PNG or JPEG. Max size 8mb
          </Text>
        )}
      </Container>
      {files && !!files.length && (
        <Button
          variant={"ghost"}
          display={"flex"}
          gap={"1rem"}
          onClick={removeAll}
        >
          <DeleteIcon color={"accentSecondary"} />
          <Text>Remove files</Text>
        </Button>
      )}
    </Flex>
  );
};

FileUploader.defaultProps = {
  config: {
    maxSize: 1_073_741_824,
  },
};

export default FileUploader;
