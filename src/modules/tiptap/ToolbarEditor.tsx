import { useCurrentEditor } from "@tiptap/react";
import { Button, Dropdown, Flex, Tooltip, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

import { ModalRender } from "../../constant";
import { useDisclosure } from "../../utils";
import {
  BoldIcon,
  BulletListIcon,
  ClearFormatIcon,
  DividerIcon,
  DropdownIcon,
  EnterDownIcon,
  HighlightIcon,
  ImageIcon,
  ItalicIcon,
  OrderedListIcon,
  PreviewIcon,
  RedoIcon,
  StrikeIcon,
  TableIcon,
  TextCenterIcon,
  TextJustifyIcon,
  TextLeftIcon,
  TextRightIcon,
  UndoIcon,
} from "../icons";

interface Props {
  value?: string;
  toolbar?: any;
  handleUploadImage?: (file: File) => Promise<string | undefined>;
}

export const ToolbarEditor = ({
  value,
  toolbar = {},
  handleUploadImage,
}: Props) => {
  const { editor } = useCurrentEditor();
  const { image = true, table = true, color = true } = toolbar;
  const inputRef = useRef<HTMLInputElement>(null);
  const inputFileRef = useRef(null);
  const [imgLoading, setImgLoading] = useState(false);

  const listText: any[] = [
    {
      label: "Heading 1",
      key: "Heading 1",
      value: 1,
      className: editor?.isActive("heading", { level: 1 }) ? "is-active" : "",
    },
    {
      label: "Heading 2",
      key: "Heading 2",
      value: 2,
      className: editor?.isActive("heading", { level: 2 }) ? "is-active" : "",
    },
    {
      label: "Heading 3",
      key: "Heading 3",
      value: 3,
      className: editor?.isActive("heading", { level: 3 }) ? "is-active" : "",
    },
    {
      label: "Heading 4",
      key: "Heading 4",
      value: 4,
      className: editor?.isActive("heading", { level: 4 }) ? "is-active" : "",
    },
    {
      label: "Heading 5",
      key: "Heading 5",
      value: 5,
      className: editor?.isActive("heading", { level: 5 }) ? "is-active" : "",
    },
    {
      label: "Normal",
      key: "normal",
      className: editor?.isActive("paragraph") ? "is-active" : "",
    },
  ];

  const listFonts: any[] = [
    {
      label: "Default",
      key: "Default",
      className: editor?.isActive("textStyle", {
        fontFamily: "var(--font-family)",
      })
        ? "is-active"
        : "",
    },
    {
      label: "Inter",
      key: "Inter",
      className: editor?.isActive("textStyle", { fontFamily: "Inter" })
        ? "is-active"
        : "",
    },
    {
      label: "Comic Sans",
      key: "Comic Sans MS",
      className: editor?.isActive("textStyle", { fontFamily: "Comic Sans" })
        ? "is-active"
        : "",
    },
    {
      label: "Serif",
      key: "serif",
      className: editor?.isActive("textStyle", { fontFamily: "serif" })
        ? "is-active"
        : "",
    },
    {
      label: "Monospace",
      key: "monospace",
      className: editor?.isActive("textStyle", { fontFamily: "monospace" })
        ? "is-active"
        : "",
    },
    {
      label: "Cursive",
      key: "cursive",
      className: editor?.isActive("textStyle", { fontFamily: "cursive" })
        ? "is-active"
        : "",
    },
  ];

  useEffect(() => {
    if (value && editor && !editor.isFocused) {
      // Save cursor position
      const { from, to } = editor.state.selection;

      // Update content
      editor.commands.setContent(value, false, { preserveWhitespace: "full" });

      // Restore cursor position
      const newFrom = Math.min(from, editor.state.doc.content.size);
      const newTo = Math.min(to, editor.state.doc.content.size);
      editor.commands.setTextSelection({ from: newFrom, to: newTo });
    }
  }, [value, editor]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const fileBlob = (data: any) => {
    const blob = new Blob([data], {
      type: data.type,
    });
    return blob;
  };

  const addImage = useCallback(
    async (data: File[]) => {
      if (data) {
        setImgLoading(true);

        const file = data[0];

        if (handleUploadImage) {
          const resUpload = await handleUploadImage(file).catch((err) => {
            message.error(err.response?.statusText);
            setImgLoading(false);
          });

          if (resUpload)
            editor?.chain()?.focus().setImage({ src: resUpload }).run();
        } else {
          const url = fileBlob(file);
          const reader = new FileReader();
          reader.readAsDataURL(url);
          reader.onloadend = function render() {
            const base64data = reader.result?.toString();
            if (base64data) {
              editor?.chain().focus().setImage({ src: base64data }).run();
            }
          };
        }

        setImgLoading(false);
      }
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="tip-tap-toolbar">
      <Tooltip title="Undo">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          // className={editor.isActive("bold") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<UndoIcon />}
        />
      </Tooltip>

      <Tooltip title="Redo">
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          // className={editor.isActive("bold") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<RedoIcon />}
        />
      </Tooltip>

      <Dropdown
        menu={{
          items: listFonts,
          // selectable: true,
          onClick: ({ key }) => {
            editor.chain().focus().setFontFamily(key).run();
          },
        }}
        trigger={["click"]}
      >
        <Button aria-label="Options" type="text">
          <Flex align="center" gap={4}>
            {listFonts.find((i) =>
              editor.isActive("textStyle", { fontFamily: i?.key }),
            )?.label || "Default"}
            <DropdownIcon />
          </Flex>
        </Button>
      </Dropdown>

      <Dropdown
        menu={{
          items: listText,
          // selectable: true,
          onClick: ({ key }) => {
            if (key.includes("Heading")) {
              const [_, level] = key.split(" ");
              editor
                .chain()
                .focus()
                .toggleHeading({ level: +level as any })
                .run();
            } else {
              editor.chain().focus().setParagraph().run();
            }
          },
        }}
        trigger={["click"]}
      >
        <Button aria-label="Options" type="text">
          <Flex align="center" gap={4}>
            {listText.find((i) =>
              editor.isActive("heading", { level: i?.value }),
            )?.label || "Normal"}
            <DropdownIcon />
          </Flex>
        </Button>
      </Dropdown>

      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            {
              label: <TextLeftIcon />,
              key: "left",
              className: editor.isActive({ textAlign: "left" })
                ? "is-active"
                : "",
            },
            {
              label: <TextRightIcon />,
              key: "right",
              className: editor.isActive({ textAlign: "right" })
                ? "is-active"
                : "",
            },
            {
              label: <TextCenterIcon />,
              key: "center",
              className: editor.isActive({ textAlign: "center" })
                ? "is-active"
                : "",
            },
            {
              label: <TextJustifyIcon />,
              key: "justify",
              className: editor.isActive({ textAlign: "justify" })
                ? "is-active"
                : "",
            },
          ],
          onClick: ({ key }) => {
            editor.chain().focus().setTextAlign(key).run();
          },
        }}
      >
        <Button size="small" type="text">
          <TextLeftIcon />
        </Button>
      </Dropdown>

      <Tooltip title="Bold">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<BoldIcon />}
        />
      </Tooltip>

      <Tooltip title="Italic">
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<ItalicIcon />}
        />
      </Tooltip>

      <Tooltip title="Strike">
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<StrikeIcon />}
        />
      </Tooltip>

      <Tooltip title="Highlight">
        <Button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<HighlightIcon />}
        />
      </Tooltip>

      <Tooltip title="Bullet List">
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<BulletListIcon />}
        />
      </Tooltip>

      <Tooltip title="Ordered List">
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          type="text"
          size="small"
          icon={<OrderedListIcon />}
        />
      </Tooltip>

      <Tooltip title="Horizontal Line">
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          type="text"
          size="small"
          icon={<DividerIcon />}
        />
      </Tooltip>

      <Tooltip title="Enter New Line">
        <Button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          type="text"
          size="small"
          icon={<EnterDownIcon />}
        />
      </Tooltip>

      {color && (
        <input
          type="color"
          onInput={(event: any) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          value={editor.getAttributes("textStyle").color}
          data-testid="setColor"
          style={{ width: "21px", height: "21px" }}
        />
      )}

      {table && (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                label: "New Table",
                key: "new",
              },
              {
                label: "Merge Cell",
                key: "merge-cell",
                disabled: !editor.can().mergeCells(),
              },
              {
                label: "New Column Before",
                key: "col-before",
                disabled: !editor.can().addColumnBefore(),
              },
              {
                label: "New Column After",
                key: "col-after",
                disabled: !editor.can().addColumnAfter(),
              },
              {
                label: "Delete Column",
                key: "col-del",
                disabled: !editor.can().deleteColumn(),
              },
              {
                label: "New Row Before",
                key: "row-before",
                disabled: !editor.can().addRowBefore(),
              },
              {
                label: "New Row After",
                key: "row-after",
                disabled: !editor.can().addRowAfter(),
              },
              {
                label: "Delete Row",
                key: "row-del",
                disabled: !editor.can().deleteRow(),
              },
              {
                label: "Delete Table",
                key: "table-del",
                disabled: !editor.can().deleteTable(),
              },
            ],
            onClick: ({ key }) => {
              switch (key) {
                case "new":
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run();
                  break;
                case "merge-cell":
                  editor.chain().focus().mergeCells().run();
                  break;
                case "col-before":
                  editor.chain().focus().addColumnBefore().run();
                  break;
                case "col-after":
                  editor.chain().focus().addColumnAfter().run();
                  break;
                case "col-del":
                  editor.chain().focus().deleteColumn().run();
                  break;
                case "row-before":
                  editor.chain().focus().addRowBefore().run();
                  break;
                case "row-after":
                  editor.chain().focus().addRowAfter().run();
                  break;
                case "row-del":
                  editor.chain().focus().deleteRow().run();
                  break;
                case "table-del":
                  editor.chain().focus().deleteTable().run();
                  break;
                default:
                  break;
              }
            },
          }}
        >
          <Button size="small" type="text">
            <TableIcon />
          </Button>
        </Dropdown>
      )}

      {image && (
        <Tooltip title="Insert Image">
          <Button
            loading={imgLoading}
            type="text"
            size="small"
            icon={<ImageIcon />}
            ref={inputFileRef}
            onClick={handleClick}
          />
        </Tooltip>
      )}

      <input
        type="file"
        onChange={(event: any) => addImage(event.target.files)}
        ref={inputRef}
        hidden
        style={{ display: "none" }}
        accept="image/*"
      />

      <Tooltip title="Clear Mark">
        <Button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          type="text"
          size="small"
          icon={<ClearFormatIcon />}
        />
      </Tooltip>

      <RenderPreview value={value || editor.getHTML()} />
    </div>
  );
};

function RenderPreview({ value }: { value?: string }) {
  const { isOpen, close, open } = useDisclosure();

  return (
    <>
      <Tooltip title="Preview">
        <Button
          type="text"
          size="small"
          icon={<PreviewIcon />}
          onClick={open}
        />
      </Tooltip>

      <ModalRender
        style={{ top: 0 }}
        title="Preview"
        open={isOpen}
        onCancel={close}
        width="80%"
        footer={false}
      >
        <div
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: value || "" }}
        ></div>
      </ModalRender>
    </>
  );
}
