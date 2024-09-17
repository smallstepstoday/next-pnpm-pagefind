import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementType } from "react";

interface ProseProps extends ComponentPropsWithoutRef<"div"> {
  as?: ElementType;
  searchParams?: string;
}

export function Prose(props: ProseProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: Component = "div", searchParams, className, ...rest } = props;
  return (
    <Component
      className={clsx(
        className,
        "prose prose-slate max-w-none md:prose-lg lg:prose-xl dark:prose-invert dark:text-slate-400",
        // headings
        "prose-headings:font-display prose-headings:scroll-mt-28 prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]",
        // h1
        "prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:text-gray-900 sm:prose-h1:text-4xl prose-h1:dark:text-gray-300",
        // lead
        "prose-lead:text-slate-500 dark:prose-lead:text-slate-400",
        // links
        "prose-a:font-semibold dark:prose-a:text-sky-400",
        // link underline
        "prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px]",
        // pre
        "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10",
        // hr
        "dark:prose-hr:border-slate-800"
      )}
      {...rest}
    />
  );
}
