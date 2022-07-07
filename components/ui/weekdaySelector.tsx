import { useEffect, useState } from "react"
import { Container, Button } from "theme-ui"

export type WeekdaySelectorProps = {
    onChange?: (selectedWeekdays: Array<number>) => any;
}

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = props => {
    const weekdays = [
        {label: 'Mon', title: 'Monday'},
        {label: 'Tue', title: 'Tuesday'},
        {label: 'Wed', title: 'Wednsday'},
        {label: 'Thr', title: 'Thursday'},
        {label: 'Fri', title: 'Friday'},
        {label: 'Sat', title: 'Saturday'},
        {label: 'Sun', title: 'Sunday'}
    ]

    const [activeWeekdays, setActiveWeekdays] = useState<Array<number>>([])

    useEffect(() => {
        props.onChange && props.onChange(activeWeekdays)
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
