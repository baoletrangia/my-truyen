"use client";

import { Editor } from "@tiptap/react";
import { cx } from "@/lib/utils";

type ToolbarButton = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

function ToolbarButton({ label, active, onClick }: ToolbarButton) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx("chip", active && "button secondary")}
    >
      {label}
    </button>
  );
}

type EditorToolbarProps = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      />
      <ToolbarButton
        label="Clear"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      />
    </div>
  );
}
