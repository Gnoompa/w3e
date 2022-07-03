import { PropsWithChildren } from 'react'
import { Flex, Box, Container, Button, Text, Divider } from 'theme-ui'

export type Option = {
    label: string;
    secondaryLabel?: string;
    tooltip?: string;
}

export interface ToggleProps extends PropsWithChildren<{
    options: Record<string, Option>;
    onChange?: (value: string) => any;
}> {}

export const Toggle = (props: ToggleProps): React.ReactElement => {
    const onOptionClick = (option: string): void => {
        props.onChange && props.onChange(option)
    }

    return (
        <Container variant='layout.container.toggle'>
            <Flex sx={{alignItems: 'center'}}>
                {Object.keys(props.options).map((key: string) =>
                    <Box key={key} sx={{position: 'relative', flex: 1}}>
                        <Button variant='toggle' sx={{width: '100%'}} data-active={true} onClick={() => onOptionClick(key)}>
                            {props.options[key].label}
                        </Button>
                        <Divider variant='styles.hr.vertical' sx={{position: 'absolute', right: 0, top: 0}} />
                        {props.options[key].secondaryLabel &&
                            <Text variant='secondary' sx={{position: 'absolute', top: 'calc(100% + .5em)', left: '50%', whiteSpace: 'nowrap', transform: 'translateX(-50%)'}}>
                                {props.options[key].secondaryLabel}
                            </Text>
                        }
                        {/* {props.options[key].tooltip && props.options[key].tooltip} */}
                    </Box>
                )}
            </Flex>
        </Container>
    )
}

export default Toggle
