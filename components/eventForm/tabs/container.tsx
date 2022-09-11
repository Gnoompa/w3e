import React, { useRef, RefObject, PropsWithChildren } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { useScrollShadow } from "helpers/hooks";

interface ContainerProps extends PropsWithChildren<{ title: string }> {}

const Container = (props: ContainerProps) => {
  const activeEventFormTabRef = useRef() as RefObject<HTMLElement>;
  const shouldShowActiveEventFormTabShadow = useScrollShadow(
    activeEventFormTabRef.current
  );

  return (
    <Flex direction={"column"}>
      <Heading
        as="h3"
        fontSize={"xx-large"}
        boxShadow={
          shouldShowActiveEventFormTabShadow ? "0 15px 15px -17px grey" : "none"
        }
        position={"relative"}
        zIndex="banner"
      >
        {props.title}
      </Heading>
      <Flex
        ref={activeEventFormTabRef}
        direction={"column"}
        maxH={"32rem"}
        px={".5rem"}
        overflowY={"scroll"}
      >
        <Flex mt={"1.5rem"} direction={"column"} gap={"1rem"}>
          {props.children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Container;
