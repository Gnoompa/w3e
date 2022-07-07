import { createContext } from "react"

export const data = {
    walletAddress: '',
    formattedWalletAddress: ''    
} as {
    walletAddress?: string;
    formattedWalletAddress?: string
}

export const AppContext = createContext(data)

export const AppContextProvider = AppContext.Provider

export default AppContext
