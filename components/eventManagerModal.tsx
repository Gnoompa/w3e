import { CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  Code,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useClipboard } from "@chakra-ui/react";
import React from "react";

export type EventManagerModalProps = Omit<ModalProps, "children"> & {
  eventTokenId: string;
};

export const Component = (props: EventManagerModalProps) => {
  const embedWidgetCode = `<iframe src="${location.origin}/embedWidget.html?event=${props.eventTokenId}" border-radius: 36px; border: none; outline: none; width: 1024px;height: 625px; max-width: calc(100% - 2rem); />`;
  const { onCopy: onCopyEmbedWidgetCode } = useClipboard(embedWidgetCode);
  const toast = useToast();

  const onCopyEmbedWidgetCodeButtonClick = () => {
    onCopyEmbedWidgetCode();

    toast({
      title: "copied embed widget code",
      status: "success",
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent
        width={"45rem"}
        maxW={"calc(100vw - 1rem)"}
        bg={"accentPrimary"}
        paddingY={"2rem"}
      >
        <Flex flexDir={"column"} gap="1rem" px={"2rem"}>
          <Flex flex={1} alignItems={"center"} justify={"space-between"}>
            <Heading color="textContrast">Manage Event</Heading>
            <ModalCloseButton
              pos={"relative"}
              top={0}
              right={0}
              color={"textContrastSecondary"}
              size={"lg"}
            />
          </Flex>
          <Flex flexDir={"column"} gap=".5rem" maxW={"100%"}>
            <Text color="textContrast" fontWeight={"bold"}>
              Embed widget code
            </Text>
            <Flex gap="1rem" alignItems={"center"}>
              <Code children={embedWidgetCode} wordBreak="break-all" flex={1} />
              <Button
                onClick={onCopyEmbedWidgetCodeButtonClick}
                variant={"secondary"}
                bg={"bg"}
                leftIcon={<CopyIcon />}
              >
                Copy
              </Button>
            </Flex>
            <Text color={"textContrastSecondary"} fontSize="sm">
              insert this code into your web page
            </Text>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default Component;
