import { useEffect, useState } from "react"
import { Container, Button } from "@chakra-ui/react"

export type Weekday = {
    label: string; // short
    title: string; // long
}

export type WeekdaySelectorProps = {
    value?: Array<number>,
    onChange?: (selectedWeekdays: Array<object>) => any;
}

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = props => {
    const weekdays = [
        {label: 'M', title: 'Monday'},
        {label: 'T', title: 'Tuesday'},
        {label: 'W', title: 'Wednsday'},
        {label: 'T', title: 'Thursday'},
        {label: 'F', title: 'Friday'},
        {label: 'S', title: 'Saturday'},
        {label: 'S', title: 'Sunday'}
    ]

    const [activeWeekdays, setActiveWeekdays] = useState<Array<number>>(props.value || [])

    useEffect(() => {
        console.log(activeWeekdays.map(activeWeekday => weekdays[activeWeekday]))
        props.onChange && props.onChange(activeWeekdays.map(activeWeekday => weekdays[activeWeekday]))
    }, [activeWeekdays])

    const isWeekdayActive = (weekdayIndex: number): boolean =>
        activeWeekdays.includes(weekdayIndex)

    const toggleActiveWeekday = (weekdayIndex: number): void => {
        isWeekdayActive(weekdayIndex)
            ? setActiveWeekdays(activeWeekdays.filter(el => el !== weekdayIndex))
            : setActiveWeekdays([...activeWeekdays, weekdayIndex])
    }

    return (
        <Container variant='layout.container.weekdaySelector'>
            {weekdays.map((weekday, index) =>
                <Button variant={isWeekdayActive(index) ? 'weekdaySelectorActive' : 'weekdaySelector'} onClick={() => toggleActiveWeekday(index)} title={weekday.title} key={index}>
                    {weekday.label}
                </Button>
            )}
        </Container>
    )
}

export default WeekdaySelector
