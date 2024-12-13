'use client';

import Image from "next/image";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useDebounce } from "use-debounce";



function Search() {

  // State to hold the search query input by the user
  const [query, setQuery] = useState("");
  
  // Hook to access the current search parameters from the URL
  const searchParams = useSearchParams();
  
  // Retrieve the 'query' parameter from the URL, defaulting to an empty string if not present
  const searchQuery = searchParams.get("query") || "";
  
  // State to store the search results, initialized as an empty array
  const [results, setResults] = useState<Models.Document[]>([]);
  
  // State to control the open/close status of the search results dropdown
  const [open, setOpen] = useState(false);
  
  // Hooks to interact with the router and pathname for navigation purposes
  const router = useRouter();
  const path = usePathname();

  // Debounce the query input to reduce the number of API calls
  const [debouncedQuery] = useDebounce(query, 300);

  // Effect to fetch files based on the debounced query
  useEffect(() => { 
    const fetchFiles = async () => { 
        // If the debounced query is empty, clear results and close the dropdown
        if (debouncedQuery.length === 0) {
          setResults([]);
          setOpen(false);
          return router.push(path.replace(searchParams.toString(), ""));
        }

       // Fetch files using the debounced query and update the results state
       const files = await getFiles({ searchText:debouncedQuery, types:[] });
       setResults(files.documents);
       setOpen(true);
    };
    fetchFiles();
  },[debouncedQuery, path, searchParams, router]);

  // Effect to sync the query state with the URL's 'query' parameter
  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  /**
   * Handles the click event on a search result item.
   * @param {Models.Document} file - The document file object clicked.
   * Closes the search results dropdown, resets the results state, and navigates to the file's type page with the search query as a parameter.
   */
  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  return (
    <div className="search">
      {/* Input wrapper with search icon */}
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {/* Conditional rendering of search results */}
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    {/* Thumbnail component for file preview */}
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  {/* Displaying formatted creation date */}
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search