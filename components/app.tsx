import { context, contextInitialValue } from "./context";
import { ConnectKitButton } from "connectkit";
import { Button, Flex } from "theme-ui";

const App: React.FC = (props) => {
  return (
    <Flex
      sx={{
        flexDirection: "column",
        width: "22rem",
        margin: "31rem auto",
        transform: "translateY(-50%)",
      }}
    >
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            <Button variant="accent" onClick={show}>
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </Button>
          );
        }}
      </ConnectKitButton.Custom>
      <context.Provider value={contextInitialValue}>
        {props.children}
      </context.Provider>
    </Flex>
  );
};

export default App;
