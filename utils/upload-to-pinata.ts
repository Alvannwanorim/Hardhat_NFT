import path from "path";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNzFhN2ExZC1hZGViLTRjMjgtOTc1Ni05ZmZmNzZjYzg4NzgiLCJlbWFpbCI6ImFsdmFubndhbm9yaW1AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjFmOWU4OWI4YjA4YzAzOWYwNDhjIiwic2NvcGVkS2V5U2VjcmV0IjoiMGNkYWMzMTBlYjU3NTliNDEwMDU4M2M4M2QyNGRmMjE1NzUyZjk4YjU0MGQyMGNjZmE1ODUzNzljMDQ2MjRiNSIsImlhdCI6MTcwMzk3MTYwNX0.QKzhqoRt4psKzrX8F23Pyk9v9lxZua5zx0SNIgRNLm4";
const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

interface Attributes {
  trait_type: string;
  value: number;
}
interface MetadataTemplate {
  name: string;
  description: string;
  image: string;
  attributes: Attributes[];
}
const metadataTemplate: MetadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "cuteness",
      value: 100,
    },
  ],
};

export async function storeImages(imagesPaths: string) {
  let uploadedItems = [];
  const fullImagesPath = path.resolve(imagesPaths);
  const files = fs.readdirSync(fullImagesPath);
  for (const file of files) {
    const data = await uploadImage(file, fullImagesPath);
    data.name = file.split(".")[0];
    uploadedItems.push(data);
  }
  return uploadedItems;
}

async function uploadImage(fileIndex: string, fullImagesPath: string) {
  const formData = new FormData();
  const file = fs.createReadStream(`${fullImagesPath}/${fileIndex}`);
  formData.append("file", file);

  const pinataMetadata = JSON.stringify({
    name: fileIndex.split(".")[0],
  });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    const res = await axios.post(PINATA_URL, formData, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${JWT}`,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
export async function handleTokenUris(uploadedItems: any[]) {
  let tokenUris = [];
  for (const item of uploadedItems) {
    console.log(`Uploading image: ${item.name}`);
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = item.name;
    tokenUriMetadata.description = `An adorable ${item.name} pup!`;
    tokenUriMetadata.image = `ipfs://${item.IpfsHash}`;

    const data = await pinJSONToIPFS(tokenUriMetadata);
    tokenUris.push(`ipfs://${data.IpfsHash}`);
  }
  return tokenUris;
}

async function pinJSONToIPFS(metadata: MetadataTemplate) {
  const body = JSON.stringify(metadata);
  try {
    const res = await axios.post(PINATA_JSON_URL, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
}
