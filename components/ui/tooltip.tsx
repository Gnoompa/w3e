import { useState } from 'react'
import { Container, Text } from 'theme-ui'

export const Tooltip: React.FC = (props) => {
    const [isTooltipTextShown, setIsTooltipTextShown] = useState(false)

    const onMouseOver = (): void => {
        props.children && setIsTooltipTextShown(true)
    }

    const onMouseLeave = (): void => {
        props.children && setIsTooltipTextShown(false)
    }

    return (
        <Container variant='layout.container.tooltip' onMouseOver={() => onMouseOver()} onMouseLeave={() => onMouseLeave()}>
            <Text sx={{fontSize: '1.25rem'}}>
                ?
            </Text>
            {isTooltipTextShown &&
                <Container variant='layout.container.popup' sx={{left: '50%', transform: 'translateX(-50%)'}}>
                    {props.children}
                </Container>
            }
        </Container>
    )
}

export default Tooltip
