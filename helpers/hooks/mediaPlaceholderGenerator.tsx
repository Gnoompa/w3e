import React from "react";
import Konva from "konva";

// generates base64 string containing image placeholder
export const generateMediaPlaceholder = (
  imageFile: Blob | string,
  placeholderSize = 10
): Promise<string> =>
  new Promise((res, rej) => {
    let image = new Image();
    let imageSrc =
      typeof imageFile == "string" ? imageFile : URL.createObjectURL(imageFile);

    image.src = imageSrc;
    image.crossOrigin = "Anonymous";

    image.onload = function () {
      let ratio = Math.min(
        placeholderSize / image.width,
        placeholderSize / image.height
      );

      var konvaImage = new Konva.Image({
        width: image.width * ratio,
        height: image.height * ratio,
        image,
      });
      var stage = new Konva.Stage({
        container: "_mediaPlaceholderGeneratorConvasContainer",
        width: image.width * ratio,
        height: image.height * ratio,
      });

      var layer = new Konva.Layer();

      stage.add(layer);
      layer.add(konvaImage);

      res(stage.toDataURL());
    };
  });

export const useMediaPlaceholderGenerator = () => {
  const CanvasContainer = () => (
    <div
      style={{ display: "none" }}
      id="_mediaPlaceholderGeneratorConvasContainer"
    />
  );

  return {
    CanvasContainer,
    generateMediaPlaceholder,
  };
};

export default useMediaPlaceholderGenerator;
