import { NextPage } from "next"
import Image from "next/image"
import { Card, Heading, Text, Badge, Paragraph } from "theme-ui"
import { Flex, Box } from "@components/index"

const AboutPage: NextPage = () => {
    return (
        <Flex column alignItemsCenter justifyItemsCenter mt="5%">
            <Box sx={{ width: '40rem' }}>
                <Box alignSelfCenter sx={{ margin: '0 auto', width: '400px' }}>
                    {/* <Image src={} alt='ticket printing machine' objectFit='contain' /> */}
                </Box>
                <Box sx={{ mt: '1rem', p: '3' }}>
                    <Paragraph mb={3}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.</Paragraph>
                </Box>
            </Box>
        </Flex>
    )
}

export default AboutPage
