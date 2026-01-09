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
  };
};
