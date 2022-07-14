import { useEffect, useRef, useState } from "react"
import { Image as ThemeImage } from "theme-ui"
import { Stage, Layer, Text, Image } from "react-konva"
import ticketTemplateImage from "../styles/images/ticketTemplate.png"

type useEventTicketImageProps = {
    eventTitle: string|undefined,
    onImageGenerated: (payload: {eventTitle: string, image: string}) => any
}

const EventTicketImage = (props: useEventTicketImageProps) => {
    const canvasRef = useRef();
    const textRef = useRef();
    const [image, setImage] = useState<ImageBitmap>()

    const ticketTemplateSize = { x: 400, y: 254 };

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        props.eventTitle && image && props.onImageGenerated({
            eventTitle: props.eventTitle,
            image: canvasRef.current.toDataURL({pixelRatio: 2 })
        })
    }, [props.eventTitle, image])

    const init = async () => {
        const response = await fetch(ticketTemplateImage.src)
        const blob = await response.blob()

        setImage(await createImageBitmap(blob))
    }

    return (
        <Stage width={ticketTemplateSize.x} height={ticketTemplateSize.y} ref={canvasRef} style={{display: 'none'}}>
            <Layer>
                <Image
                    image={image}
                    width={ticketTemplateSize.x}
                    height={ticketTemplateSize.y}
                />
                <Text
                    text={props.eventTitle}
                    wrap="wrap"
                    fontStyle="800"
                    ellipsis={true}
                    width={ticketTemplateSize.x * .6}
                    height={254}
                    interfill="#401384"
                    fontSize={35}
                    verticalAlign='middle'
                    fontFamily="inter"
                    letterSpacing={2}
                    x={ticketTemplateSize.x * 0.3}
                    ref={textRef}
                />
                {/* <Text
                    text={eventDate}
                    fontSize={eventDateFontsize}
                    fontStyle="800"
                    fontFamily="inter"
                    fill="#650969"
                    y={ticketTemplateSize.y * 0.69}
                    x={ticketTemplateSize.x * 0.27}
                />
                <Text
                    text={eventTime}
                    fontSize={eventDateFontsize * .7}
                    fontStyle="800"
                    fontFamily="inter"
                    fill="#650969"
                    y={ticketTemplateSize.y * 0.81}
                    x={ticketTemplateSize.x * 0.27}
                /> */}
            </Layer>
        </Stage>
    )
}

export default EventTicketImage
