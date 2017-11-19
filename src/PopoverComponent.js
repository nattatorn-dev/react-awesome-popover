import React from "react";
import { Popper } from "react-popper";
import ArrowComponent from "./ArrowComponent";

export default class PopoverComponent extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.closePopoverOnMouseLeave = this.closePopoverOnMouseLeave.bind(this);
  }

  closePopoverOnMouseLeave(e) {
    e.preventDefault();
    this.props.onClosePopover();
  }
  click(e) {
    const thispopover = this.refs.popover._node;
    const close = e.target.closest(".popover-content");
    if (!close) {
      this.props.onClosePopover();
    } else {
      const child_popover = thispopover.querySelector(".popover-content");
      if (!child_popover) {
        if (
          close.getAttribute("data-id") != thispopover.getAttribute("data-id")
        ) {
          this.props.onClosePopover();
        }
      }
    }
  }

  componentWillUnmount() {
    const { action, onClose } = this.props;
    if (action === "click") {
      document.removeEventListener("click", this.click, false);
    } else if (action === "hover") {
      document.removeEventListener("mouseover", this.onMouseOver, false);
      this.refs.popover._node.removeEventListener(
        "mouseleave",
        this.closePopoverOnMouseLeave,
        false
      );
    }

    if (onClose) onClose();
  }

  onMouseOver(e) {
    const popover = this.refs.popover._node;
    const child = popover.querySelector(".popover-content");
    if (!child) {
      popover.addEventListener(
        "mouseleave",
        this.closePopoverOnMouseLeave,
        false
      );
    }
    if (!e.target.closest(".manager")) {
      this.props.onClosePopover();
    }
  }

  componentDidMount() {
    const { action, onOpen } = this.props;
    if (action === "click") {
      document.addEventListener("click", this.click, false);
    } else if (action === "hover") {
      document.addEventListener("mouseover", this.onMouseOver, false);
    }

    if (onOpen) onOpen();
  }

  render() {
    const {
      placement,
      arrow,
      className,
      motion,
      id,
      customArrow,
      children
    } = this.props;

    return (
      <Popper placement={placement} ref="popover">
        {({ popperProps }) => {
          popperProps.className = "popover-content";
          if (arrow) {
            popperProps.className = `popover-content rap-${
              popperProps["data-placement"]
            }`;
          }
          if (className) {
            popperProps.className += ` ${className}`;
          }

          if (motion) {
            var ArrowCallback = arrow ? (
              <ArrowComponent
                customArrow={customArrow}
                dataPlacement={popperProps["data-placement"]}
              />
            ) : null;
            return children[1]({ "data-id": id }, popperProps, ArrowCallback);
          } else {
            return (
              <div {...popperProps} data-id={id}>
                <div>
                  {children[1]}
                  {arrow ? (
                    <ArrowComponent
                      customArrow={customArrow}
                      dataPlacement={popperProps["data-placement"]}
                    />
                  ) : null}
                </div>
              </div>
            );
          }
        }}
      </Popper>
    );
  }
}
