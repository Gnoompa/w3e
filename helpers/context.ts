import { createContext } from "react"
import { useWeb3APIProvider } from "./contract"

export const data = {
    walletAddress: '',
    formattedWalletAddress: '',
    web3APIProvider: {}
} as {
    walletAddress?: string;
    formattedWalletAddress?: string;
    web3APIProvider: ReturnType<typeof useWeb3APIProvider>
}

export const AppContext = createContext(data)

export const AppContextProvider = AppContext.Provider

export default AppContext
