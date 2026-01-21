"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { FC } from "react";
import { zh } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@/styles/editor.css";
import { cn } from "@/lib/utils";
interface EditorProps {
  value?: string;
  className?: string;
}

const Editor: FC<EditorProps> = ({ value, className }) => {
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
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={"light"}
      className={cn(className, "bn-readonly-editor")}
    ></BlockNoteView>
  );
};

Editor.displayName = "Editor";

export default Editor;
