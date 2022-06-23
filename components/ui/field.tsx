import React, { ElementType } from 'react'
import { Flex, WrappedFlexProps } from '@components/index'
import { Label, Input, FieldProps, InputProps } from "theme-ui"

export const Field = function Field<
    Z extends React.ComponentPropsWithRef<ElementType> & WrappedFlexProps = InputProps & WrappedFlexProps,
    T extends React.ElementType = React.ComponentType<Z>
>({
    as: Control = Input as any as T,
    id,
    label,
    ...rest
}: FieldProps<T>) {
    const omitMargin = (props: Object) => ((newProps: any) => (
        ['ml', 'mr', 'mt', 'mb', 'mx', 'my'].map(key => delete newProps[key]),
        newProps
    ))({...props})


    const controlProps = omitMargin({
        ...rest,
        sx: undefined
    } as React.ComponentPropsWithRef<T>)

    return (
        <Flex column {...rest}>
            <Label htmlFor={id} mb='.5rem' variant={rest.variant}>{label}</Label>
            <Control {...controlProps} />
        </Flex>
    )
}

export default Field
