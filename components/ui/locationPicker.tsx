import { PropsWithChildren, useState, useEffect, SyntheticEvent, ChangeEvent } from 'react'
import { Portal } from 'react-portal'
import { Field } from './field'
import locationIcon from '../../styles/icons/location.svg'
import { Flex, Box, InputProps, Text, Container, Button } from 'theme-ui'

export type Location = {
    label: string;
    lat?: number;
    lng?: number;
}

interface LocationPickerProps extends Omit<InputProps, 'onChange' | 'value'> {
    value?: Location | undefined,
    onChange?: (location: Location) => any
}

export const LocationPicker = (props: PropsWithChildren<LocationPickerProps>) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isMapOpen, setIsMapOpen] = useState(false)

    const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        props.onChange && props.onChange({label: event.target.value})
    }

    return (
        <Container>
            {isMapOpen &&
                <Portal>
                    <Container variant='layout.container.modalBackground'>
                        <Flex sx={{flexDirection: 'column', margin: '22rem auto', maxWidth: '23rem'}}>
                            <Text as='h2'>
                                Choose Location
                            </Text>
                        </Flex>
                    </Container>
                </Portal>
            }
            <Field variant='forms.input.dialog' value={props.value?.label} onChange={onInputChange} placeholder={props.placeholder || 'location'} onBlur={() => setIsDialogOpen(false)} onFocus={() => setIsDialogOpen(true)} onClick={() => setIsDialogOpen(true)} icon='📍' />
            {/* {isDialogOpen &&
                <Container variant='layout.container.popup' sx={{width: '70%', right: 0}}>
                    <Flex sx={{flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                        <Text variant='dialog'>
                            enter manually
                        </Text>
                        <Text variant='dialogSecondary'>
                            OR
                        </Text>
                        <Box sx={{alignSelf: 'center'}}>
                            <Button variant='primary' onMouseDown={() => setIsMapOpen(true)}>use map</Button>
                        </Box>
                    </Flex>
                </Container>
            } */}
        </Container>
    )
}

export default LocationPicker
