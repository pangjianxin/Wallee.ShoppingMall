import { mallMediaDownload, mallMediaGet } from "@/openapi";
export const download = async (data: { id: string }) => {
  const { data: media } = await mallMediaGet({
    throwOnError: true,
    path: {
      id: data.id,
    },
  });

  const { data: blob } = await mallMediaDownload({
    throwOnError: true,
    //responseType: "blob",
    path: {
      id: data.id,
    },
  });
  if (blob) {
    saveBlobToFile(blob, `${media.name}`);
  }
};

const saveBlobToFile = (blob: Blob, fileName: string) => {
  // Create a blob URL
  const blobURL = window.URL.createObjectURL(blob);

  // Create an anchor element for the download
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = fileName || "download.dat"; // Provide a default file name if none is provided

  // Append the anchor to the document
  document.body.appendChild(a);

  // Simulate a click on the anchor to initiate the download
  a.click();

  // Clean up: remove the anchor and revoke the blob URL
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobURL);
};
