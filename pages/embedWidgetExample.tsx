import { Flex, Heading } from "@chakra-ui/react";
import { getPageRouteURLEndpoint, useRouterQuery } from "helpers/hooks";
import { Routes } from "helpers/routes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const Component = () => {
  const router = useRouter();
  const routerQuery = useRouterQuery(router);
  const [eventId, setEventId] = useState<string>();

  useEffect(() => {
    setEventId(routerQuery.eventId);
  }, []);

  return (
    <Flex
      flexDir={"column"}
      gap="2rem"
      align={"center"}
      justify={"center"}
      py="5rem"
    >
      <Heading color={["bg", "textAccentSecondary"]} fontWeight="bold" fontSize={["2xl", "3rem"]}>
        Web3Events Widget Example
      </Heading>
      {eventId && (
        <iframe
          src={`${getPageRouteURLEndpoint(
            Routes.EmbedWidget
          )}?eventId=${eventId}`}
          style={{
            borderRadius: "36px",
            border: "none",
            outline: "none",
            width: "1024px",
            height: "688px",
            maxWidth: "calc(100% - 2rem)",
          }}
        />
      )}
    </Flex>
  );
};

export default Component;
