import { mallMediaCreate, mallMediaDelete } from "@/openapi";

export const useMedia = () => {
  const uploadMedia = async (file: File) => {
    const { data } = await mallMediaCreate({
      throwOnError: true,
      query: {
        FileName: file.name,
      },
      body: {
        File: file,
      },
    });
    return data;
  };

  const uploadMediaAndReturnUrl = async (file: File) => {
    const { data } = await mallMediaCreate({
      throwOnError: true,
      query: {
        FileName: file.name,
      },
      body: {
        File: file,
      },
    });
    return `${process.env.NEXT_PUBLIC_MEDIA_DOWNLOAD_URL}/${data.id}`;
  };

  const deleteMedia = async (mediaId: string) => {
    await mallMediaDelete({
      throwOnError: false,
      path: {
        id: mediaId,
      },
    });
  };

  return {
    uploadMedia,
    deleteMedia,
    uploadMediaAndReturnUrl,
  };
};
