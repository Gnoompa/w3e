import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { ConnectKitProvider, ConnectKitButton, getDefaultClient, useModal } from "connectkit"
import dynamic from 'next/dynamic'
import { Flex, Box, Button, Heading, useColorMode, useThemeUI, Card, Text, Link, Label, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'

const EventForm = dynamic(() => import('./eventForm'), {
	loading: () => <Spinner sx={{margin: '20rem auto', transform: 'translateY(-50%)'}} />
})

const EventPage = dynamic(() => import('./eventPage'), {
	loading: () => <Spinner sx={{margin: '20rem auto', transform: 'translateY(-50%)'}} />
})

const EventExplorer = dynamic(() => import('./eventExplorer'), {
	loading: () => <Spinner sx={{margin: '20rem auto', transform: 'translateY(-50%)'}} />
})

const App: NextPage = () => {
	enum Routes {
		StartPage,
		EventForm,
		EventPage,
		EventExplorer
	}
	
	const router = useRouter()
	const [routerPath, setRouterPath] = useState<Routes>()

	useEffect(() => {
		// todo use nextjs new layout system once released
		setRouterPath(({
				'/': Routes.StartPage,
				'/#createEvent': Routes.EventForm,
				'/#event': Routes.EventPage,
				'/#eventExplorer': Routes.EventExplorer
		})[router.asPath.split('?')[0] || '/'])
	}, [router.asPath])

	return (
		<Flex bg='bg' sx={{flexDirection: 'column', maxWidth: '100%'}}>
			<Flex sx={{flexDirection: 'column', width: '100%', maxWidth: '1280px', position: 'relative', margin: '10rem auto', alignItems: 'center'}}>
				<ConnectKitButton.Custom>
					{({ isConnected, show, truncatedAddress, ensName }) => {
						console.log(isConnected)
						return (
							<Button onClick={show}>
								{isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
							</Button>
						);
					}}
				</ConnectKitButton.Custom>
				<Button mt='2rem' variant='accent' onClick={() => router.push('/#')}>
					create new event
				</Button>
			</Flex>
		</Flex>
	)
}

export default App
