import React, { useState, useMemo, useContext, useLayoutEffect, forwardRef } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  useId,
} from "@floating-ui/react";

export function usePopover({
  initialOpen = false,
  placement = 'top-start',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState();
  const [descriptionId, setDescriptionId] = useState();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(-20),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "end",
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  });

  const context = data.context;
  const click = useClick(context, { enabled: controlledOpen == null });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}

const PopoverContext = React.createContext(null);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (context == null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }
  return context;
};

export function Popover({ children, modal = false, ...restOptions }) {
  const popover = usePopover({ modal, ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

export const PopoverTrigger = forwardRef(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = children.ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      ...props,
      ...children.props,
      "data-state": context.open ? "open" : "closed",
      ...context.getReferenceProps(),
    });
  }

  return (
    <button ref={ref} type="button" data-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
      {children}
    </button>
  );
});

export const PopoverContent = forwardRef(function PopoverContent({ style, ...props }, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

export const PopoverHeading = forwardRef(function PopoverHeading(props, ref) {
  const { setLabelId } = usePopoverContext();
  const id = useId();

  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {props.children}
    </h2>
  );
});

export const PopoverDescription = forwardRef(function PopoverDescription(props, ref) {
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p {...props} ref={ref} id={id}>
      {props.children}
    </p>
  );
});

export const PopoverClose = forwardRef(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
});
