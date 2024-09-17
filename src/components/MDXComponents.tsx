import { ComponentPropsWithoutRef } from "react";
import { Prose } from "./Prose";

export const MDXComponents = {
  wrapper(props: ComponentPropsWithoutRef<"div">) {
    const { className, ...rest } = props;
    return <Prose className={className} {...rest} />;
  },
};
