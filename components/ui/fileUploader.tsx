import { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import { Flex, Box, Container, Text } from 'theme-ui'
import cameraIcon from '../../styles/icons/camera.svg'
import NextImage from 'next/image'

type FileUploaderProps = {
    subtitle?: string;
}

export const FileUploader = (props: FileUploaderProps) => {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

      return (
        <Container variant='layout.container.fileUploader' {...getRootProps()}>
            <input {...getInputProps()} />
            <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{width: '3rem', height: '3rem'}}>
                    <NextImage width='100%' height='100%' src={cameraIcon} alt='upload poster image' objectFit='fill' />
                </Box>
                {props.subtitle &&
                    <Text mt='.25rem' variant='hint'>{props.subtitle}</Text>
                }
            </Flex>
        </Container>
      )
}

export default FileUploader
