import { PropsWithChildren, useState, useEffect, SyntheticEvent, ChangeEvent } from 'react'
import { Field } from './field'
import calendarIcon from '../../styles/icons/calendar.svg'
import { Flex, Box, InputProps, Text, Container, Button, Switch, Label } from 'theme-ui'
import { WeekdaySelector } from '@components/index'
import OutsideClickHandler from 'react-outside-click-handler'
import { useDebounce, handleOnMouseDown, formatWalletAddress } from 'helpers/hooks'
import date from 'date-and-time'
import { Weekday } from './weekdaySelector'

export enum DateTimeType {
    fromDate = 'fromDate',
    fromTime = 'fromTime',
    toDate = 'toDate',
    toTime = 'toTime',
    weekdays = 'weekdays',
    at = 'at'
}

export type Timespan = {
    fromDate?: string;
    fromTime?: string;
    toDate?: string;
    toTime?: string;
    isPerpetual?: boolean;
    weekdays?: Array<Weekday>,
    at?: string;
}

interface TimespanPickerProps extends Omit<InputProps, 'onChange' | 'value'> {
    value?: Timespan | undefined,
    onChange?: (timespan: Timespan | undefined) => any
}

export const TimespanPicker = (props: PropsWithChildren<TimespanPickerProps>) => {
    const [timespan, setTimespan] = useState<Timespan|undefined>(props.value)
    const [fromDate, setFromDate] = useState<string>()
    const [fromTime, setFromTime] = useState<string>()
    const [toDate, setToDate] = useState<string>()
    const [toTime, setToTime] = useState<string>()
    const [at, setAt] = useState<string>()
    const [isPerpetual, setIsPerpetual] = useState(false)
    const [isFromToday, setIsFromToday] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const today = date.format(new Date(), 'YYYY-MM-DD')

    useEffect(() => {
        props.onChange && props.onChange({
            ...timespan,
            fromDate,
            fromTime,
            toDate,
            toTime,
            isPerpetual,
            at
        })
    }, [timespan])

    useEffect(() => {
        isFromToday && setFromDate(today)
    }, [today, isFromToday])

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
                                        <Field value={fromDate} onChange={event => setFromDate(event.target.value)} min={today} disabled={isFromToday} variant='forms.input.dialogTransparent' sx={{flex: 1}} type='date' />
                                        <Field value={fromTime} onChange={event => setFromTime(event.target.value)} variant='forms.input.dialogTransparent' type='time' />
                                    </Flex>
                                </Flex>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Flex sx={{alignItems: 'center'}}>
                                        <Text as='h2'>
                                            To
                                        </Text>
                                        <Flex ml='1rem'>
                                            <Switch value={+isPerpetual} checked={isPerpetual} id="isPerpetual" onChange={() => setIsPerpetual(!isPerpetual)} />
                                            <Label htmlFor="isPerpetual" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
                                                indefinite
                                            </Label>
                                        </Flex>
                                    </Flex>
                                    <Flex sx={{gap: '1rem'}}>
                                        <Field value={toDate} onChange={event => setToDate(event.target.value)} disabled={!!isPerpetual} min={today} variant='forms.input.dialogTransparent' sx={{flex: 1}} type='date' />
                                        <Field value={toTime} onChange={event => setToTime(event.target.value)} disabled={!!isPerpetual} variant='forms.input.dialogTransparent' type='time' />
                                    </Flex>
                                </Flex>
                                <Flex sx={{flexDirection: 'column', gap: '1rem'}}>
                                    <Text as='h2'>
                                        Happens Every
                                    </Text>
                                    <WeekdaySelector value={timespan?.weekdays} onChange={weekdays => setTimespan({...timespan, weekdays: weekdays})} />
                                </Flex>
                                <Flex sx={{gap: '1rem', alignItems: 'center'}}>
                                    <Text as='h2'>
                                        At
                                    </Text>
                                    <Flex sx={{gap: '1rem'}}>
                                        <Field value={at} onChange={event => setAt(event.target.value)} variant='forms.input.dialogTransparent' type='time' />
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
