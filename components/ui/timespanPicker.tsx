import { PropsWithChildren, useState, useEffect, SyntheticEvent, ChangeEvent } from 'react'
import { Field } from './field'
import calendarIcon from '../../styles/icons/calendar.svg'
import { Flex, Box, InputProps, Text, Container, Button, Switch, Label } from 'theme-ui'
import { WeekdaySelector } from '@components/index'
import OutsideClickHandler from 'react-outside-click-handler'
import { useDebounce, handleOnMouseDown, formatWalletAddress } from 'helpers/hooks'
import date from 'date-and-time'

export enum DateTimeType {
    fromDate = 'fromDate',
    fromTime = 'fromTime',
    toDate = 'toDate',
    toTime = 'toTime',
    weekdays = 'weekdays',
    at = 'at'
}

export type Timespan = {
    fromDate?: number;
    fromTime?: number;
    toDate?: number;
    toTime?: number;
    isIndefinite?: boolean;
    weekdays?: Array<number>, // from Mon
    at?: number;
}

interface TimespanPickerProps extends Omit<InputProps, 'onChange' | 'value'> {
    value?: Timespan | undefined,
    onChange?: (timespan: Timespan | undefined) => any,
    showWeekdays?: boolean
}

export const TimespanPicker = (props: PropsWithChildren<TimespanPickerProps>) => {
    const [timespan, setTimespan] = useState<Timespan>({})
    const [fromDate, setFromDate] = useState<string>()
    const [fromTime, setFromTime] = useState<string>()
    const [toDate, setToDate] = useState<string>()
    const [toTime, setToTime] = useState<string>()
    const [isIndefinite, setIsIndefinite] = useState<string>()
    const [at, setAt] = useState<string>()
    const [isPerpetual, setIsPerpetual] = useState(0)
    const [isWeeklyEvent, setIsWeeklyEvent] = useState(0)
    const [isFromToday, setIsFromToday] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const today = date.format(new Date(), 'YYYY-MM-DD')

    useEffect(() => {
        props.onChange && props.onChange(timespan)
    }, [timespan])

    useEffect(() => {
        isFromToday && setFromDate(today)
    }, [today, isFromToday])

    const onInputChange = (event: ChangeEvent<HTMLInputElement>, type: DateTimeType): void => {
        setTimespan({...timespan, [type]: event.target.value})
    }

    return (
        <Container sx={{position: 'relative'}}>
            <Field variant='forms.input.dialog' placeholder='date/time' readOnly onMouseDown={event => handleOnMouseDown(event, () => setIsDialogOpen(!isDialogOpen))} icon='📅' />
            {isDialogOpen &&
                <OutsideClickHandler
                    onOutsideClick={() => setIsDialogOpen(false)}
                    useCapture
                    display='contents'
                >
                    <Container variant='layout.container.popup' sx={{maxWidth: '100vw', right: 0}}>
                        <Flex sx={{flexDirection: 'column'}}>
                            <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Flex sx={{alignItems: 'center'}}>
                                        <Text as='h2'>
                                            From
                                        </Text>
                                        <Flex ml='1rem'>
                                            <Switch value={+isFromToday} checked={isFromToday} id="isFromToday" onChange={() => setIsFromToday(!isFromToday)} />
                                            <Label htmlFor="isFromToday" variant='forms.label.switch'>
                                                today
                                            </Label>
                                        </Flex>
                                    </Flex>
                                    <Flex sx={{gap: '1rem'}}>
                                        <Field value={fromDate} onChange={event => onInputChange(event, DateTimeType.fromDate)} disabled={isFromToday} variant='forms.input.dialogTransparent' type='date' />
                                        <Field value={fromTime} onChange={event => onInputChange(event, DateTimeType.fromTime)} variant='forms.input.dialogTransparent' type='time' />
                                    </Flex>
                                </Flex>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Flex sx={{alignItems: 'center'}}>
                                        <Text as='h2'>
                                            To
                                        </Text>
                                        <Flex ml='1rem'>
                                            <Switch value={isPerpetual} checked={isPerpetual} id="isPerpetual" onChange={() => setIsPerpetual(+!isPerpetual)} />
                                            <Label htmlFor="isPerpetual" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
                                                indefinite
                                            </Label>
                                        </Flex>
                                    </Flex>
                                    <Flex sx={{gap: '1rem'}}>
                                        <Field value={toDate} onChange={event => onInputChange(event, DateTimeType.toDate)} disabled={!!isPerpetual} variant='forms.input.dialogTransparent' type='date' />
                                        <Field value={toTime} onChange={event => onInputChange(event, DateTimeType.toTime)} disabled={!!isPerpetual} variant='forms.input.dialogTransparent' type='time' />
                                    </Flex>
                                </Flex>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Text as='h2'>
                                        Happens Every
                                    </Text>
                                    <WeekdaySelector onChange={weekdays => setTimespan({...timespan, weekdays: weekdays})} />
                                </Flex>
                                <Flex sx={{gap: '1rem', alignItems: 'center'}}>
                                    <Text as='h2'>
                                        At
                                    </Text>
                                    <Flex sx={{gap: '1rem'}}>
                                        <Field value={timespan.at} onChange={event => onInputChange(event, DateTimeType.at)} variant='forms.input.dialogTransparent' type='time' />
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Container>
                </OutsideClickHandler>
            }
        </Container>
    )
}

export default TimespanPicker
