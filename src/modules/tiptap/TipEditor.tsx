import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageResize from "tiptap-extension-resize-image";

import { extractImgListSrc } from "@/utils";

import { ToolbarEditor } from "./ToolbarEditor";
import "./scss/tip-tap.scss";

interface Props {
  error?: string;
  disabled?: boolean;
  required?: boolean;
  ellipsis?: boolean;
  onChange?: (value?: string) => void;
  value?: string;
  tableResize?: boolean;
  deleteFile?: ({ link }: { link: string }) => Promise<any>;
  handleUploadImage?: (file: File) => Promise<string | undefined>;
}

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

export const TipEditor = (props: Props) => {
  const { error, disabled, onChange, value, tableResize = true } = props;

  const extensions: Extensions = [
    StarterKit,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    FontFamily,
    Highlight,
    TextStyle,
    Color,
    Document,
    Table.configure({
      resizable: tableResize,
    }),
    Image.configure({
      allowBase64: true,
      // inline: true,
    }),
    ImageResize.configure({
      // inline: true,
      allowBase64: true,
    }),
    // TableCell,
    TableHeader,
    TableRow,

    CustomTableCell,
  ];
  const contentRef = useRef(value);
  const [border, setBorder] = useState("");
  const handleInput = (style: any) => {
    if (error && !disabled) {
      setBorder("error");
    } else {
      setBorder(style);
    }
  };

  useEffect(() => {
    if (disabled) {
      setBorder("");
    }
  }, []);

  useEffect(() => {
    handleInput("");
  }, [error]);

  return (
    <div className="input-rich-container rich-editor">
      <fieldset
        className={border}
        onFocusCapture={() => handleInput("active")}
        onBlur={() => handleInput("")}
      >
        <EditorProvider
          slotBefore={
            <ToolbarEditor
              value={value}
              toolbar={toolbar}
              handleUploadImage={props.handleUploadImage}
            />
          }
          extensions={extensions}
          content={contentRef.current}
          editable={disabled ? false : true}
          editorProps={{
            attributes: {
              spellCheck: "false",
            },
          }}
          onUpdate={({ editor }) => {
            // Extract list src from both original and updated HTML
            const originalListSrc = extractImgListSrc(value || "");
            const updatedListSrc = extractImgListSrc(editor.getHTML());

            // Find srcs that are in originalSrcs but not in updatedSrcs
            const deletedListSrc = originalListSrc.filter(
              (src) => !updatedListSrc.includes(src),
            );

            function removeBaseUrl(url: string) {
              const regex = /^https?:\/\/[^\/]+\/api\//;
              return url.replace(regex, "");
            }

            deletedListSrc.forEach((path) => {
              props.deleteFile?.({ link: removeBaseUrl(path) });
            });

            onChange?.(editor?.getHTML());
          }}
        />
      </fieldset>
      {!disabled && error && (
        <Typography.Text type="danger">{error}</Typography.Text>
      )}
    </div>
  );
};
