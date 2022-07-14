import { useCallback, useEffect, useState } from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'
import { Flex, Box, Container, Text, Button } from 'theme-ui'
import cameraIcon from '../../styles/icons/picture.svg'
import NextImage from 'next/image'

type FileUploaderProps = {
    subtitle?: string;
    config?: DropzoneOptions,
    onChange?: (files: Array<Blob>) => any
}

export const FileUploader = (props: FileUploaderProps) => {
    const [files, setFiles] = useState<Array<Blob>>([])
    const [preview, setPreview] = useState<string>()

    useEffect(() => {
        props.onChange?.(files)

        setPreview(
            files.length == 1 && files[0].type.match(/image|video/)
                ? URL.createObjectURL(files[0])
                : undefined
        )
    }, [files])

    const onDrop = useCallback(acceptedFiles => {
        setFiles([...acceptedFiles])
    }, [])

    const {getRootProps, getInputProps, open} = useDropzone({
        onDrop,
        ...props.config
    })

    const removeFile = (file: Blob) => () => {
        const newFiles = [...files]

        newFiles.splice(newFiles.indexOf(file), 1)
        setFiles(newFiles)
    }

    const removeAll = () => {
        setFiles([])
    }

    return (
        <Flex sx={{flexDirection: 'column'}}>
            <Container variant='layout.container.fileUploader' {...getRootProps()}>
                <input {...getInputProps()} />
                {preview
                    ? <NextImage src={preview} width='100%' height='100%' objectFit='contain' alt='uploaded image'></NextImage>
                    : <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
                        <Box sx={{width: '3rem', height: '3rem'}}>
                            <NextImage width='100%' height='100%' src={cameraIcon} alt='upload poster image' objectFit='fill' />
                        </Box>
                        {files.length > 1
                            ? <Text mt='.5rem' variant='hint'>({files.length}) files</Text>
                            : props.subtitle &&
                                <Text mt='.5rem' variant='hint'>{props.subtitle}</Text>
                        }
                    </Flex>
                }
            </Container>
            {!!files.length &&
                <Button onClick={removeAll} mt='.5rem' variant='accentSmall' sx={{alignSelf: 'center', zIndex: 1}}>
                    clear
                </Button>
            }
        </Flex>
      )
}

FileUploader.defaultProps = {
    config: {
        maxSize: 1_073_741_824
    }
}

export default FileUploader
