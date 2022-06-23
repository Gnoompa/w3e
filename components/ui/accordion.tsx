import { useState, useMemo, useCallback } from "react"
import { Divider, Label, IconButton } from "theme-ui"
import { ArrowDropDownRounded } from "@mui/icons-material"
import { Flex } from "@components/index"

const indexGenerator = (function*() {
	let index = 0

	while(true)
		yield index++
})()

const AccordionState: React.FC = (props) => {
    const [state, setState] = useState({index: undefined})
	const index = useMemo(() => indexGenerator.next().value, [])

	return props.children({state, setState, index})
}

export const Accordion: React.FC = (props): JSX.Element => {
    return (
        <Flex column {...props} />
    )
}

export interface AccordionItemProps {
    label: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({children, label}): JSX.Element => {
    return (
        <AccordionState>
            {({state, setState, index}) =>
                <Flex column>
                    <Flex alignItemsCenter>
                        <IconButton aria-label="Toggle FAQ topic">
                            <ArrowDropDownRounded />
                        </IconButton>
                        <Label onClick={() => setState({...state, index: state.index == index ? undefined: index})} sx={{cursor: 'pointer'}}>
                            {label}
                        </Label>
                    </Flex>
                    {state.index == index && children}
                    <Divider />
                </Flex>
            }
        </AccordionState>
    )
}

export default Accordion
