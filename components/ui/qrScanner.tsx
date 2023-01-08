import { ethers } from "ethers";
import QrScannerAdapter from "qr-scanner";
import { formatWalletAddress } from "helpers/hooks";
import { Container, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

type QrScannerProps = {
  showResult?: boolean;
  onResult: (result: string) => any;
  onError?: (error: any) => any;
};

export const QrScanner = (props: QrScannerProps) => {
  const videoRef = useRef();

  const [result, setResult] = useState("");

  useEffect(() => {
    let scanner = new QrScannerAdapter(videoRef.current, setResult, {
      onDecodeError: props.onError,
      highlightScanRegion: true,
    });

    scanner.start().then(() => {}, props.onError);

    return () => scanner.stop();
  }, []);

  useEffect(() => {
    props.onResult(result?.data);
  }, [result]);

  return (
    <Container variant="scanner">
      <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
        <video style={{ width: "100%" }} ref={videoRef} />
      </Flex>
    </Container>
  );
};

QrScanner.defaultProps = {
  showResult: true,
};

export default QrScanner;
