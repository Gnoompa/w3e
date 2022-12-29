import axios from "axios";

export const uploadToArweave = async (data: any): Promise<string> => {
  try {
    const upload = await axios(`https://api.lenster.xyz/metadata/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });

    const { id }: { id: string } = upload?.data;

    return id;
  } catch {
    throw new Error("Arweave upload error");
  }
};

export const uploadFileToArweave = async (file: Blob): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const upload = await axios(`https://api.lenster.xyz/metadata/upload`, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      data: file,
    });

    const { id }: { id: string } = upload?.data;

    return id;
  } catch {
    throw new Error("Arweave upload error");
  }
};

export default uploadToArweave;
