"use client";

import { useState, useMemo } from "react";
import { getLevelConfig } from "@/levels/cefr";

/**
 * Configuration properties for the generic SearchFilter component.
 * 
 * @template T - The type of items being filtered.
 */
interface SearchFilterProps<T extends Record<string, any>> {
  /** The array of raw data items to be filtered and searched. */
  items: T[];
  /** Array of object keys (e.g., ['german', 'english']) that the text search should match against. */
  searchKeys: (keyof T)[];
  /** The object key used to generate the discrete toggle buttons. */
  filterKey: keyof T;
  /** A user-facing label for the filter (currently unused in the UI, but preserved for semantic purposes). */
  filterLabel: string;
  /** A render prop function that receives the filtered subset of items and returns the React nodes to display them. */
  render: (filtered: T[]) => React.ReactNode;
  /** Optional placeholder text for the search input field. */
  placeholder?: string;
}

/**
 * A highly reusable generic component that provides client-side text search and discrete category/level filtering.
 * It manages its own state for the search string and active filter button, and uses a render prop (`render`)
 * to delegate the actual rendering of the filtered items back to the parent component.
 * 
 * @param props - SearchFilterProps
 * @returns A UI containing a search bar, a row of toggle buttons, and the rendered output of the filtered items.
 */
export default function SearchFilter<T extends Record<string, any>>({
  items,
  searchKeys,
  filterKey,
  filterLabel,
  render,
  placeholder = "Search...",
}: SearchFilterProps<T>) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = items;

    if (activeFilter !== "all") {
      result = result.filter((item) => String(item[filterKey]) === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key];
          if (typeof val === "string") return val.toLowerCase().includes(q);
          return false;
        })
      );
    }

    return result;
  }, [items, search, activeFilter, searchKeys, filterKey]);

  const filterValues = useMemo(() => {
    const vals = new Set<string>();
    for (const item of items) {
      const val = item[filterKey];
      if (typeof val === "string") vals.add(val);
    }
    return [...vals].sort();
  }, [items, filterKey]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-yellow-400 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            All
          </button>
          {filterValues.map((val) => {
            const isLevel = /^[ABC][12]$/.test(val);
            return (
              <button
                key={val}
                onClick={() => setActiveFilter(activeFilter === val ? "all" : val)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === val
                    ? isLevel
                      ? `${getLevelConfig(val).bgColor} ${getLevelConfig(val).textColor} border-2 border-yellow-400`
                      : "bg-yellow-400 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
      {render(filtered)}
    </div>
  );
}