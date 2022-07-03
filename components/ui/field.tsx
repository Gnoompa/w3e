import React, { ElementType } from 'react'
import { Flex, Box, Label, Input, InputProps, Divider, Text} from "theme-ui"
import { ImageProps } from 'next/image';
import NextImage from 'next/image'

export interface FieldProps extends InputProps {
    isInvalid?: boolean;
    postfix?: string;
    subtitle?: string;
    icon?: ImageProps['src'];
}

export const Field: React.FC<FieldProps> = props => {
    return (
        <Flex sx={{position: 'relative'}}>
            <Flex sx={{flexDirection: 'column', flex: 1, position: 'relative'}}>
                <Input variant={props.variant || 'forms.input.field'} {...props} sx={{...props.sx, ...(props.icon && {paddingRight: '2.5rem'})}} />
                {!props.variant?.includes('forms.input.dialog') &&
                    <Divider variant={props.isInvalid ? 'styles.hr.invalidField' : 'styles.hr.field'}  />
                }
                {props.icon &&
                    <Flex variant='layout.container.field.icon'>
                        <NextImage src={props.icon} alt='input icon' />
                    </Flex>
                }
            </Flex>
            {props.postfix &&
                <Text variant='secondary' mt='.25rem' sx={{fontSize: '1.25rem', fontWeight: 700}}>
                    {props.postfix}
                </Text>
            }
            {props.subtitle &&
                <Text variant='hint' sx={{position: 'absolute', right: '1rem', top: 'calc(100% + .75rem)', fontSize: '.75rem'}}>
                    {props.subtitle}
                </Text>
            }
        </Flex>
    )
}

export default Field
