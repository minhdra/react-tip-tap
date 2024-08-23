import { IconCircleX } from "@tabler/icons-react";
import { Flex, Modal, ModalProps, Typography } from "antd";

export const ModalRender = (props: ModalProps) => {
  return (
    <Modal
      style={{ top: 54 }}
      closable={false}
      okText={"Save"}
      cancelText={"Cancel"}
      className="modal-tip-tap"
      okButtonProps={{
        className: "btn btn-primary",
        style: {
          minWidth: 70,
        },
      }}
      cancelButtonProps={{
        className: "btn btn-default",
        style: {
          minWidth: 70,
        },
      }}
      footer={(child) => {
        const isCenter = props.className?.includes("modal-tip-tap-center");
        return (
          <Flex
            justify={isCenter ? "center" : "flex-end"}
            align="center"
            gap={8}
          >
            {child}
          </Flex>
        );
      }}
      destroyOnClose
      maskClosable={false}
      {...props}
      title={undefined}
    >
      <Flex justify="space-between" className="modal-title-wrap">
        <Typography.Title level={4}>{props.title}</Typography.Title>

        <span style={{ cursor: "pointer" }} onClick={props.onCancel}>
          <IconCircleX />
        </span>
      </Flex>
      <div className="modal-body">{props.children}</div>
    </Modal>
  );
};
