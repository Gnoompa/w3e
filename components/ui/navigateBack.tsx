
import React, { PropsWithChildren } from "react"
import { Text, Label, Input, FieldProps, InputProps, Flex, Link } from "theme-ui"
import arrowBackSvg from '../../styles/icons/arrowBack.svg'
import Image from 'next/image'
import NextLink from 'next/link'

export const NavigateBack = (props: PropsWithChildren<{href: string}>) => {
    return (
        <Flex>
            <NextLink href={props.href} passHref>
                <Link variant='formNav'>
                    <Flex sx={{alignItems: 'center'}}>
                        <Image src={arrowBackSvg} alt='back to ticketing' />
                        <Text ml='1em' variant='navigation'>
                            {props.children}
                        </Text>
                    </Flex>
                </Link>
            </NextLink>
        </Flex>
    )
}

export default NavigateBack
