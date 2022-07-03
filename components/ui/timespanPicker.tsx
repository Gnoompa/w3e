import { PropsWithChildren, useState, useEffect, SyntheticEvent, ChangeEvent } from 'react'
import { Field } from './field'
import calendarIcon from '../../styles/icons/calendar.svg'
import { Flex, Box, InputProps, Text, Container, Button } from 'theme-ui'
import OutsideClickHandler from 'react-outside-click-handler'

export enum DateTimeType {
    fromDate = 'fromDate',
    fromTime = 'fromTime',
    toDate = 'toDate',
    toTime = 'toTime'
}

export type Timespan = {
    fromDate?: number;
    fromTime?: number;
    toDate?: number;
    toTime?: number;
}

interface TimespanPickerProps extends Omit<InputProps, 'onChange' | 'value'> {
    value?: Timespan | undefined,
    onChange?: (timespan: Timespan | undefined) => any
}

export const TimespanPicker = (props: PropsWithChildren<TimespanPickerProps>) => {
    const [timespan, setTimespan] = useState<Timespan>({})
    const [inputValue, setInputValue] = useState('')
    const [isPerpetual, setIsPerpetual] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        props.onChange && props.onChange(timespan)
    }, [props.onChange, timespan])

    useEffect(() => {
        setIsPerpetual(false)
    }, [timespan])

    useEffect(() => {
        isPerpetual && setIsDialogOpen(false)

        setInputValue(isPerpetual ? 'perpetual' : props.placeholder || 'timespan')
    }, [isPerpetual])

    const onInputChange = (event: ChangeEvent<HTMLInputElement>, type: DateTimeType): void => {
        setTimespan({...timespan, [type]: event.target.value})
    }

    return (
        <Container sx={{position: 'relative'}}>
            <Field variant='forms.input.dialog' value={inputValue} readOnly onFocus={() => setIsDialogOpen(true)} onClick={() => setIsDialogOpen(true)} icon={calendarIcon} />
            {isDialogOpen &&
                <OutsideClickHandler
                    onOutsideClick={() => setIsDialogOpen(false)}
                    useCapture={true}
                    display='contents'
                >
                    <Container variant='layout.container.popup' sx={{maxWidth: '100vw', right: 0}}>
                        <Flex sx={{flexDirection: 'column'}}>
                            <Flex sx={{gap: '2rem'}}>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Text as='h2'>
                                        From:
                                    </Text>
                                    <Field value={timespan.fromDate} onChange={event => onInputChange(event, DateTimeType.fromDate)} variant='forms.input.dialogTransparent' type='date' />
                                    <Field value={timespan.fromTime} onChange={event => onInputChange(event, DateTimeType.fromTime)} variant='forms.input.dialogTransparent' type='time' />
                                </Flex>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Text as='h2'>
                                        To:
                                    </Text>
                                    <Field value={timespan.toDate} onChange={event => onInputChange(event, DateTimeType.toDate)} variant='forms.input.dialogTransparent' type='date' />
                                    <Field value={timespan.toTime} onChange={event => onInputChange(event, DateTimeType.toTime)} variant='forms.input.dialogTransparent' type='time' />
                                </Flex>
                            </Flex>
                            <Flex mt='1rem' sx={{flexDirection: 'column', alignItems: 'center'}}>
                                <Text variant='dialogSecondary'>
                                    OR
                                </Text>
                                <Button mt='1rem' onClick={() => setIsPerpetual(true)}>
                                    set as perpetual
                                </Button>
                            </Flex>
                        </Flex>
                    </Container>
                </OutsideClickHandler>
            }
        </Container>
    )
}

export default TimespanPicker
