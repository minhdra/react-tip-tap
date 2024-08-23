import { NodeViewWrapper, isNumber } from "@tiptap/react";
import { Button, Flex, Popover, Tooltip } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { clamp, throttle } from "../../../../utils";
import {
  LLetterIcon,
  MLetterIcon,
  SLetterIcon,
  TextCenterIcon,
  TextLeftIcon,
  TextRightIcon,
  TrashIcon,
} from "../../../icons";

const ResizeDirection = {
  TOP_LEFT: "tl",
  TOP_RIGHT: "tr",
  BOTTOM_LEFT: "bl",
  BOTTOM_RIGHT: "br",
};

/** Minimum size for image adjustments */
const IMAGE_MIN_SIZE = 20 as const;
/** Maximum size for image adjustments */
const IMAGE_MAX_SIZE = 100_000 as const;
/** Throttle time during adjustments for images (milliseconds) */
const IMAGE_THROTTLE_WAIT_TIME = 16 as const;
/** Options for setting image size in the bubble menu */
enum IMAGE_SIZE {
  "size-small" = 200,
  "size-medium" = 500,
  "size-large" = 1000,
}

export const ImageView = (props: any): JSX.Element => {
  const [maxSize, setMaxSize] = useState<{ width: number; height: number }>({
    width: IMAGE_MAX_SIZE,
    height: IMAGE_MAX_SIZE,
  });
  const [resizing, setResizing] = useState(false);
  const [resizerState, setResizerState] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dir: "",
  });

  const [originalSize, setOriginalSize] = useState({
    width: 0,
    height: 0,
  });

  const [resizeDirections] = useState<string[]>([
    ResizeDirection.TOP_LEFT,
    ResizeDirection.TOP_RIGHT,
    ResizeDirection.BOTTOM_LEFT,
    ResizeDirection.BOTTOM_RIGHT,
  ]);

  const imgAttrs = useMemo(() => {
    const { src, alt, width: w, height: h } = props?.node?.attrs;
    const width = isNumber(w) ? `${w}px` : w;
    const height = isNumber(h) ? `${h}px` : h;
    return {
      src: src || undefined,
      alt: alt || undefined,
      style: {
        width: width || undefined,
        height: height || undefined,
      },
    };
  }, [props?.node?.attrs]);

  const imageMaxStyle = useMemo(() => {
    const {
      style: { width },
    } = imgAttrs;

    return { width: width === "100%" ? width : undefined };
  }, [imgAttrs]);

  function selectImage() {
    const { editor, getPos } = props;
    editor.commands.setNodeSelection(getPos());
  }

  function onMouseDown(e: MouseEvent, dir: string) {
    e.preventDefault();
    e.stopPropagation();

    const originalWidth = originalSize.width;
    const originalHeight = originalSize.height;
    const aspectRatio = originalWidth / originalHeight;

    let width = Number(props.node.attrs.width);
    let height = Number(props.node.attrs.height);
    const maxWidth = maxSize.width;

    if (width && !height) {
      width = width > maxWidth ? maxWidth : width;
      height = Math.round(width / aspectRatio);
    } else if (height && !width) {
      width = Math.round(height * aspectRatio);
      width = width > maxWidth ? maxWidth : width;
    } else if (!width && !height) {
      width = originalWidth > maxWidth ? maxWidth : originalWidth;
      height = Math.round(width / aspectRatio);
    } else {
      width = width > maxWidth ? maxWidth : width;
    }

    flushSync(() => {
      setResizing(true);

      setResizerState({
        x: e.clientX,
        y: e.clientY,
        w: width,
        h: height,
        dir,
      });
    });
  }

  const onMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!resizing) {
        return;
      }

      const { x, w, dir } = resizerState;

      const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1);
      // const dy = (e.clientY - y) * (/t/.test(dir) ? -1 : 1)

      const width = clamp(w + dx, IMAGE_MIN_SIZE, maxSize.width);
      const height = null;

      props.updateAttributes({
        width,
        height,
      });
    }, IMAGE_THROTTLE_WAIT_TIME),
    [resizing, resizerState, maxSize, props.updateAttributes],
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!resizing) {
        return;
      }

      flushSync(() => {
        setResizerState({
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          dir: "",
        });
        setResizing(false);
      });

      selectImage();

      return new Promise(() => {});
    },
    [resizing, selectImage],
  );

  const onEvents = useCallback(() => {
    document?.addEventListener("mousemove", onMouseMove, true);
    document?.addEventListener("mouseup", onMouseUp, true);
  }, [onMouseMove, onMouseUp]);

  const offEvents = useCallback(() => {
    document?.removeEventListener("mousemove", onMouseMove, true);
    document?.removeEventListener("mouseup", onMouseUp, true);
  }, [onMouseMove, onMouseUp]);
  useEffect(() => {
    if (resizing) {
      onEvents();
    } else {
      offEvents();
    }

    return () => {
      offEvents();
    };
  }, [resizing, onEvents, offEvents]);

  const getMaxSize = useCallback(
    throttle(() => {
      const { editor } = props as any;
      const { width } = getComputedStyle(editor.view.dom);
      setMaxSize((prev) => {
        return {
          ...prev,
          width: Number.parseInt(width, 10),
        };
      });
    }, IMAGE_THROTTLE_WAIT_TIME),
    [props?.editor],
  );

  function onImageLoad(e: Record<string, any>) {
    setOriginalSize({
      width: e.target.width,
      height: e.target.height,
    });
  }

  const resizeOb: ResizeObserver = useMemo(() => {
    return new ResizeObserver(() => getMaxSize());
  }, [getMaxSize]);

  useEffect(() => {
    resizeOb.observe(props.editor.view.dom);

    return () => {
      resizeOb.disconnect();
    };
  }, [props.editor.view.dom, resizeOb]);

  const [openPopover, setOpenPopover] = useState(false);
  const handleSetTextAlignImage = (placement: string) => {
    props.editor.commands.setTextAlign(placement);
    setOpenPopover(false);
  };

  const handleSetSizeImage = (size: keyof typeof IMAGE_SIZE) => {
    props.editor.commands.updateImage({ width: IMAGE_SIZE[size] });
    setOpenPopover(false);
  };

  return (
    <NodeViewWrapper
      className="image-view"
      style={{ ...imageMaxStyle, width: "100%" }}
    >
      <div
        draggable
        style={imageMaxStyle}
        className={`image-view__body ${props?.selected ? "image-view__body--focused" : ""} ${
          resizing ? "image-view__body--resizing" : ""
        }`}
      >
        <Popover
          overlayInnerStyle={{ padding: 4 }}
          content={
            <Flex>
              <Tooltip title="Small">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleSetSizeImage("size-small")}
                  className={
                    props.editor.isActive("image", {
                      width: IMAGE_SIZE["size-small"],
                    })
                      ? "is-active"
                      : ""
                  }
                >
                  <SLetterIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Medium">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleSetSizeImage("size-medium")}
                  className={
                    props.editor.isActive("image", {
                      width: IMAGE_SIZE["size-medium"],
                    })
                      ? "is-active"
                      : ""
                  }
                >
                  <MLetterIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Large">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleSetSizeImage("size-large")}
                  className={
                    props.editor.isActive("image", {
                      width: IMAGE_SIZE["size-large"],
                    })
                      ? "is-active"
                      : ""
                  }
                >
                  <LLetterIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Left">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleSetTextAlignImage("left")}
                  className={
                    props.editor.isActive({ textAlign: "left" })
                      ? "is-active"
                      : ""
                  }
                >
                  <TextLeftIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Center">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleSetTextAlignImage("center")}
                  className={
                    props.editor.isActive({ textAlign: "center" })
                      ? "is-active"
                      : ""
                  }
                >
                  <TextCenterIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Right">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleSetTextAlignImage("right")}
                  className={
                    props.editor.isActive({ textAlign: "right" })
                      ? "is-active"
                      : ""
                  }
                >
                  <TextRightIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  size="small"
                  type="text"
                  onClick={() => props.editor.commands.deleteSelection()}
                >
                  <TrashIcon />
                </Button>
              </Tooltip>
            </Flex>
          }
          open={openPopover}
          arrow={false}
          trigger={["click"]}
          onOpenChange={setOpenPopover}
        >
          <img
            src={imgAttrs.src}
            alt={imgAttrs.alt}
            style={imgAttrs.style}
            height="auto"
            className="image-view__body__image block"
            onLoad={onImageLoad}
            onClick={selectImage}
          />
          {props?.editor.view.editable && (props?.selected || resizing) && (
            <div className="image-resizer">
              {resizeDirections?.map((direction) => {
                return (
                  <span
                    key={direction}
                    className={`image-resizer__handler image-resizer__handler--${direction}`}
                    onMouseDown={(e: any) => onMouseDown(e, direction)}
                  ></span>
                );
              })}
            </div>
          )}
        </Popover>
      </div>
    </NodeViewWrapper>
  );
};
