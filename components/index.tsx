import { default as React, ReactChild, ReactChildren, ReactElement, ReactNode } from "react";
import { Flex as OriginFlex, Box as OriginBox, FlexProps, BoxProps, SxProp, ThemeUIStyleObject } from "theme-ui"

export interface WrappedFlexProps extends FlexProps {
    column?: boolean;
    row?: boolean;
    center?: boolean;
    fixedCenter?: boolean;
    alignItemsCenter?: boolean;
    alignSelfCenter?: boolean;
    justifyItemsCenter?: boolean;
    justifySelfCenter?: boolean;
    justifyAround?: boolean;
    justifyBetween?: boolean;
}

const processProps = (props: WrappedFlexProps): ThemeUIStyleObject => ({
    flexDirection: props.column ? 'column' : props.row ? 'row' : 'initial',
    alignItems: props.alignItemsCenter ? 'center' : 'initial',
    alignSelf: props.alignSelfCenter ? 'center' : 'initial',
    justifyItems: props.justifyItemsCenter ? 'center' : 'initial',
    justifySelf: props.justifySelfCenter ? 'center' : 'initial',
    justifyContent: props.justifyBetween ? 'space-between' : 'initial',    
    ...((props.center || props.fixedCenter) && {
        position: props.fixedCenter ? 'fixed' : 'initial',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    })
})

export const Flex = (props: WrappedFlexProps) => {
    return (
        <OriginFlex
            {...props}
            sx={{
                ...props.sx,
                ...processProps(props)
            }}
        />
    )
}

export const Box = (props: WrappedFlexProps) => {
    return (
        <OriginBox
            sx={{
                ...props.sx,
                ...processProps(props)
            }}
            {...props}
        />
    )
}

export { Accordion, AccordionItem } from './ui/accordion'
export { Field } from './ui/field'
