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
        <Flex sx={{position: 'relative', flexDirection: 'column'}}>
            <Flex sx={{flexDirection: 'column', flex: 1, position: 'relative'}}>
                <Box>
                    {props.icon && (typeof(props.icon) == 'string'
                        ? <Text variant='fieldIcon'>{props.icon}</Text>
                        : <Flex variant='layout.container.field.icon'>
                            <NextImage src={props.icon} alt='input icon' />
                        </Flex>
                    )}
                    <Input variant={props.variant || 'forms.input.field'} {...props} sx={{...props.sx, ...(props.icon && {paddingLeft: '3.25rem'})}} />
                </Box>
                {!props.variant?.includes('forms.input.dialog') &&
                    <Divider variant={props.isInvalid ? 'styles.hr.invalidField' : 'styles.hr.field'}  />
                }
                {props.postfix &&
                    <Text variant='fieldPostfix'>
                        {props.postfix}
                    </Text>
                }
            </Flex>
            {props.subtitle &&
                <Text variant='fieldSubtitle'>
                    {props.subtitle}
                </Text>
            }
        </Flex>
    )
}

export default Field
