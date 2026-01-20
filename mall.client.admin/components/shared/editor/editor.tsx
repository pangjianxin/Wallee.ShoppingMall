"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { FC } from "react";
import { useMedia } from "@/hooks/medias/use-media";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { zh } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@/styles/editor.css";
import { cn } from "@/lib/utils";
interface EditorProps {
  value?: string;
  readonly?: boolean;
  className?: string;
  onChange?: (content: string) => void;
}

const Editor: FC<EditorProps> = ({ value, readonly, className, onChange }) => {
  const { uploadMediaAndReturnUrl } = useMedia();

  const editor = useCreateBlockNote({
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
    initialContent: value ? JSON.parse(value) : undefined,
    sideMenuDetection: "editor",
    dictionary: zh,
    uploadFile: uploadMediaAndReturnUrl,
  });

  const handleOnChange = useDebouncedCallback(() => {
    const json = JSON.stringify(editor.document);
    onChange?.(json);
  }, 300);

  return (
    <BlockNoteView
      editor={editor}
      editable={!readonly}
      theme={"light"}
      onChange={!readonly ? handleOnChange : undefined}
      className={cn(className, readonly ? "bn-readonly-editor" : "")}
    ></BlockNoteView>
  );
};

Editor.displayName = "Editor";

export default Editor;
