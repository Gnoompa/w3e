import { Flex, Field } from "@components/indexx"
import { useEffect } from "react"
import { Button, Label, Input, Container, Textarea } from "theme-ui"

const TicketForm = () => {
    useEffect(() => {

    }, [])

    return (
        <Container sx={{ width: '30rem', maxWidth: '100%' }}>
            <Flex column>
                <Label>Ticket Label</Label>
                <Flex mt='2rem' justifyBetween>
                    <Label>qty</Label>
                    <Label>price</Label>
                </Flex>
                <Label>desc</Label>
                <Button sx={{alignSelf: 'center'}} mt='3rem' variant="contrast">receive ticket</Button>
            </Flex>
        </Container>
    )
}

export default TicketForm
