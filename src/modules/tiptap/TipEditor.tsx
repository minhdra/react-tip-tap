import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

import "../../assets/scss/tip-tap.scss";
import { extractImgListSrc } from "../../utils";
import { Image } from "../extensions/image";
import { ToolbarEditor } from "./ToolbarEditor";

interface Props {
  /** Should use state to watch error
   * @example Form.useWatch("error", form)
   */
  error?: string;
  disabled?: boolean;
  onChange?: (value?: string) => void;
  /** Use it if you not use form instance */
  value?: string;
  /** @default true */
  tableResize?: boolean;
  /** This function to delete file from your server, single file at once */
  deleteFile?: ({ link }: { link: string }) => Promise<any>;
  /**
   * This function to upload file image to your server, single file at once
   *
   * If you not server, default is base64 format
   */
  handleUploadImage?: (file: File) => Promise<string | undefined>;
}

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this?.parent?.(),

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
    // Document,
    Table.configure({
      resizable: tableResize,
    }),
    Image.configure({
      allowBase64: true,
      // inline: true,
    }),
    // TableCell,
    TableHeader,
    TableRow,

    CustomTableCell,
  ];
  const contentRef = useRef(value || "");
  const [border, setBorder] = useState("");
  const handleInput = (style: any) => {
    if (error && error === "<p></p>" && !disabled) {
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
    <div className={`input-rich-container rich-editor ${border}`}>
      <fieldset
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
      {/* {!disabled && error && (
        <Typography.Text type="danger">{error}</Typography.Text>
      )} */}
    </div>
  );
};
