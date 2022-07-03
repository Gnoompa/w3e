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
        <Flex variant='styles.dialog' sx={{flexDirection: 'column', margin: '50vh auto', transform: 'translateY(-50%)', fontSize: '1.25rem'}}>
            <Flex sx={{alignItems: 'center'}}>
                <Box sx={{maxWidth: '4.5em'}}>
                    <Image src={explorePicture} alt='explore event icon' objectFit='contain' />
                </Box>
                <NextLink href='#exploreEvents' passHref>
                    <Link ml='.75em' variant='dialog'>explore events</Link>
                </NextLink>
            </Flex>
            <Divider variant='styles.hr.dialog' />
            <Flex sx={{alignItems: 'center'}}>
                <Box sx={{maxWidth: '4.5em'}}>
                    <Image src={notepadPicture} alt='create an event icon' objectFit='contain' />
                </Box>
                <NextLink href='#createEvent' passHref>
                    <Link ml='.75em' variant='dialog'>create an event</Link>
                </NextLink>
            </Flex>
            <Divider variant='styles.hr.dialog' />
            <Flex sx={{alignItems: 'center'}}>
                <Box sx={{maxWidth: '4.5em'}}>
                    <Image src={myEventsPicture} alt='my events image' objectFit='contain' />
                </Box>
                <NextLink href='#myEvents' passHref>
                    <Link ml='.75em' variant='dialog'>my events</Link>
                </NextLink>
            </Flex>
        </Flex>
    )
}

export default Menu
