"use client";

import clsx from "clsx";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    pagefind: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pagefind types unavailable
      search: (query: string) => Promise<{ results: any[] }>;
      init: () => void;
      options: (options: { baseUrl: string; bundlePath: string }) => void;
    };
  }
}

// This is an attempt to define return type from `pagefind`
interface PagefindData {
  url: string;
  content: ReactNode;
  word_count: 180;
  filters: Record<string, unknown>;
  meta: Metadata;
  anchors: Array<string>;
  weighted_locations: Array<{
    weight: number;
    balanced_scoe: number;
    location: number;
  }>;
  locations: Array<number>;
  raw_content: ReactNode;
  raw_url: string;
  excerpt: ReactNode;
  sub_results: Array<{
    title: string;
    url: string;
    weighted_locations: Array<{
      weight: number;
      balanced_scoe: number;
      location: number;
    }>;
    locations: Array<number>;
    excerpt: ReactNode;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- pagefind types unavailable
function Result({ result }: { result: any }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<PagefindData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data: PagefindData = await result.data();
      setData({
        ...data,
        url: data.url.replace(".html", ""),
      });
    }
    fetchData();
  }, [result]);

  if (!data) return null;

  return (
    <Link href={data.url}>
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-300">
        {data.meta.title as string}
      </h3>
      <p
        className="[&>mark]:font-bold text-neutral-600 dark:text-neutral-400"
        dangerouslySetInnerHTML={{ __html: data.excerpt as string }}
      ></p>
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pagefind types unavailable
  const [results, setResults] = useState<Array<any>>([]);

  useEffect(() => {
    async function loadPagefind() {
      if (typeof window.pagefind === "undefined") {
        try {
          window.pagefind = await import(
            // @ts-expect-error pagefind.js generated after build
            /* webpackIgnore: true */ "./pagefind/pagefind.js"
          );
          await window.pagefind.options({
            baseUrl: "/",
            bundlePath: "/_next/server/app/",
          });
          window.pagefind.init();
        } catch (_e: unknown) {
          window.pagefind = {
            search: async () => ({ results: [] }),
            init: () => {},
            options: () => {},
          };
        }
      }
    }
    loadPagefind();
  }, []);

  useEffect(() => {
    console.log("here", ref.current);
    ref.current?.focus();
  }, []);

  async function handleSearch() {
    if (window.pagefind) {
      const search = await window.pagefind.search(query);
      setResults(search.results);
    }
  }

  return (
    <div className="flex flex-col">
      <header className="pt-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl text-neutral-900 dark:text-neutral-300">
            Search
          </h2>
          <p className="mt-2 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            This is the search page
          </p>
        </div>
      </header>
      <div>
        <div className="my-10">
          <input
            id="search-input"
            type="text"
            autoComplete="given-name"
            placeholder="Search articles and case studies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onInput={handleSearch}
            className="text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-neutral-600 dark:bg-gray-800/75 dark:text-gray-300 dark:ring-inset dark:ring-white/5 dark:hover:bg-gray-700/40 dark:hover:ring-gray-500 placeholder:text-grary-500 w-full py-2 px-4"
            // autoFocus
            ref={ref}
          />
        </div>
        {results.length !== 0 && (
          <div id="results" className="mt-24 flex flex-col space-y-4">
            <h2 className={clsx("text-lg")}>Results</h2>
            {results.map((result) => (
              <Result key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
