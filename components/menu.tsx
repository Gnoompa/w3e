import { Link, Flex, Box, Button, Label, Input, Container, Textarea, Divider } from "theme-ui"
import notepadPicture from '../public/notepad/notepad@0.12x.png'
import explorePicture from '../public/planet/planet@0.1x.png'
import myEventsPicture from '../public/folder/folder@0.1x.png'
import NextLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Menu = () => {
    const router = useRouter()

    return (
        <Flex sx={{flexDirection: 'column', margin: '50vh auto', transform: 'translateY(-50%)', fontSize: '1.25rem', gap: '1.25rem'}}>
            <Button variant='accent' sx={{position: 'relative'}}>
                <Flex sx={{alignItems: 'center', justifyContent: 'center'}}>
                    <Box mr='1rem' sx={{left: '1rem', maxWidth: '3.5em'}}>
                        <Image src={explorePicture} alt='explore event icon' width='30px' height='30px' objectFit='contain' />
                    </Box>
                    explore events
                </Flex>
            </Button>
            <Button variant='accent' sx={{position: 'relative'}}>
                <Flex sx={{alignItems: 'center'}} onClick={() => router.push('/#createEvent')}>
                    <Box mr='1rem' sx={{maxWidth: '3.5em'}}>
                        <Image src={notepadPicture} alt='create an event icon' width='30px' height='30px' objectFit='contain' />
                    </Box>
                    create an event
                </Flex>
            </Button>
            <Button variant='accent' sx={{position: 'relative'}}>
                <Flex sx={{alignItems: 'center'}}>
                    <Box mr='1rem' sx={{maxWidth: '3.5em'}}>
                        <Image src={myEventsPicture} alt='my events image' width='30px' height='30px' objectFit='contain' />
                    </Box>
                    my events
                </Flex>
            </Button>
        </Flex>
    )
}

export default Menu
