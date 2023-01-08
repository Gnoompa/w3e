import { uploadFileToArweave } from "./uploadToArweave";
import { truncate } from "lodash";

export const getPlaceholderNftUrl = async (
  content: string,
  upload: boolean = false
) => {
  const svg = `<svg
  width="500"
  height="500"
  viewBox="0 0 500 500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <image
    href="https://api.web3events.ai/media/QmS57ZEBMpXPaSu1fKVpKFKSzHd23G3sHeyUZiztg5Z1LM"
    width="500px"
    height="500px"
  ></image>
  <foreignObject x="75" y="240" width="350" height="300">
    <p style="color:"#fff";font-weight:"bold";font-family:"sans-serif";fontSize: "30px";"
      xmlns="http://www.w3.org/1999/xhtml"
    >
      ${truncate(content.replace(/\n/g, " ").replace(/ {2}/g, " "), {
        length: 42,
      })}
    </p>
  </foreignObject>
</svg>
`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const file = new File([blob], "post.svg", {
    lastModified: new Date().getTime(),
    type: blob.type,
  });

  const result = upload ? await uploadFileToArweave(file) : file;

  return result ?? null;
};

export default getPlaceholderNftUrl;
