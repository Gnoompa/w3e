import type { NextPage } from 'next'
import process from 'process'
import { WagmiConfig, createClient, chain, useAccount } from "wagmi"
import { ConnectKitProvider, ConnectKitButton, getDefaultClient, useModal } from "connectkit"
import App from '../components/app'

const Index: NextPage = () => {

	console.log(process.env.alchemyId,)
	const client = createClient(
		getDefaultClient({
			appName: "Your App Name",
		  alchemyId: process.env.alchemyId,
			chains: [chain.polygonMumbai]
		}),
	)

	return (
		<WagmiConfig client={client}>
			<ConnectKitProvider>
				<App />
			</ConnectKitProvider>
		</WagmiConfig>
	)
}

export default Index
