import type { NextPage } from 'next'
import { Flex, Button } from 'theme-ui'
import { useRouter } from 'next/router'
import { Routes } from 'helpers/routes'

const StartPage: NextPage = () => {
	const router = useRouter()

	return (
		<Flex bg='bg' sx={{flexDirection: 'column', maxWidth: '100%'}}>
			<Flex sx={{flexDirection: 'column', width: '100%', maxWidth: '1280px', position: 'relative', margin: '10rem auto', alignItems: 'center'}}>
				<Button mt='2rem' variant='accent' onClick={() => router.push(Routes.EventForm)}>
					create new event
				</Button>
			</Flex>
		</Flex>
	)
}

export default StartPage
