import nextMDX from "@next/mdx";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { recmaImportImages } from "recma-import-images";
// import rehypeShiki from '@leafac/rehype-shiki'
// import * as shiki from 'shiki'

// import { remarkRehypeWrap } from 'remark-rehype-wrap'
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import { unifiedConditional } from "unified-conditional";
import escapeStringRegexp from "escape-string-regexp";
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
};

function remarkMDXLayout(source, metaName) {
  let parser = Parser.extend(jsx());
  let parseOptions = { ecmaVersion: "latest", sourceType: "module" };

  return (tree) => {
    let imp = `import _Layout from '${source}'`;
    let exp = `export default function Layout(props) {
      return <_Layout {...props} ${metaName}={${metaName}} />
    }`;

    tree.children.push(
      {
        type: "mdxjsEsm",
        value: imp,
        data: { estree: parser.parse(imp, parseOptions) },
      },
      {
        type: "mdxjsEsm",
        value: exp,
        data: { estree: parser.parse(exp, parseOptions) },
      }
    );
  };
}

export default async function config() {
  const withMDX = nextMDX({
    extension: /\.mdx$/,
    options: {
      recmaPlugins: [recmaImportImages],
      rehypePlugins: [
        // [rehypeShiki, { highlighter }],
        // Use the following strategy if the goal is to define all MDX prose
        // within `typography` divs with all React components as siblings.
        // It is not necessary since we are using Tailwind Typography plugin
        // which provides a `not-prose` class to sandbox the embedded React
        // components, preventing the Tailwind process classes from being
        // appplied.
        //
        // [
        //   remarkRehypeWrap,
        //   {
        //     node: { type: 'mdxJsxFlowElement', name: 'Typography' },
        //     start: ':root > :not(mdxJsxFlowElement)',
        //     end: ':root > mdxJsxFlowElement',
        //   },
        // ],
      ],
      remarkPlugins: [
        remarkGfm,
        remarkUnwrapImages,
        [
          // This section determines how the wrappers get applied to the
          // individual pages.
          // TODO Need to determine whether the `layout.tsx` files would work instead
          unifiedConditional,
          [
            new RegExp(`^${escapeStringRegexp(path.resolve("src/app/blog"))}`),
            [[remarkMDXLayout, "@/app/blog/wrapper", "article"]],
          ],
          [
            new RegExp(
              `^${escapeStringRegexp(path.resolve("src/app/projects"))}`
            ),
            [[remarkMDXLayout, "@/app/projects/wrapper", "caseStudy"]],
          ],
        ],
      ],
    },
  });

  return withMDX(nextConfig);
}
