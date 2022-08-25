import { context, contextInitialValue } from "./context";
import { ConnectKitButton } from "connectkit";
import { Button } from "theme-ui";

const App: React.FC = (props) => {
  return (
    <>
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            <Button onClick={show}>
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </Button>
          );
        }}
      </ConnectKitButton.Custom>
      <context.Provider value={contextInitialValue}>
        {props.children}
      </context.Provider>
    </>
  );
};

export default App;
