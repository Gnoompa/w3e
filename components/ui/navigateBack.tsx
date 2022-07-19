import React, { PropsWithChildren } from "react"
import { Text, Label, Input, FieldProps, InputProps, Flex, Link, Button } from "theme-ui"
import arrowBackSvg from '../../styles/icons/arrowBack.svg'
import Image from 'next/image'
import NextLink from 'next/link'

export const NavigateBack = (props: PropsWithChildren<{asButton?: boolean, onClick?: (e: any) => void, href?: string}>) => {
    return (
        <Flex>
            {props.asButton
                ? <Button variant='formNav' onClick={props.onClick}>
                    <Flex sx={{alignItems: 'center'}}>
                        <Image src={arrowBackSvg} width='30px' height='30px' alt='back' />
                        <Text ml='1em' variant='navigation'>
                            {props.children}
                        </Text>
                    </Flex>
                </Button>
                : <NextLink href={props.href || ''} passHref>
                    <Link variant='formNav'>
                        <Flex sx={{alignItems: 'center'}}>
                            <Image src={arrowBackSvg} width='30px' height='30px' alt='back' />
                            <Text ml='1em' variant='navigation'>
                                {props.children}
                            </Text>
                        </Flex>
                    </Link>
                </NextLink>
            }
        </Flex>
    )
}

export default NavigateBack
