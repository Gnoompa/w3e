import { Flex, Field } from "@components/index"
import { Button, Label, Input, Container, Textarea } from "theme-ui"

const TicketForm = () => {
    return (
        <Container sx={{ width: '30rem', maxWidth: '100%' }}>
            <Flex column>
                <Field label='event name' variant="contrast" />
                <Flex mt='2rem' justifyBetween>
                    <Field label='qty' type='number' min='0' sx={{ flex: '.3' }} variant="contrast" />
                    <Field label='price' ml='2rem' sx={{ flex: '.7' }} variant="contrast" />
                </Flex>
                <Field label='description' mt='2rem' as={Textarea} variant="contrast" />
                <Button sx={{alignSelf: 'center'}} mt='3rem' variant="contrast">create ticket</Button>
            </Flex>
        </Container>
    )
}

export default TicketForm
