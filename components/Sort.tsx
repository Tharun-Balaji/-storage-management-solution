'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { sortTypes } from "@/constants";

/**
 * Sort component renders a dropdown menu to select a sorting option.
 * It updates the URL with the selected sort value as a query parameter
 * when a different sorting option is chosen.
 *
 * @returns {JSX.Element} A dropdown menu with sorting options.
 */
function Sort() {
  const path = usePathname();
  const router = useRouter();

  /**
   * Updates the current URL with the specified sort value as a query parameter.
   *
   * @param {string} value - The sort value to be appended to the URL.
   */
  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      {/* The trigger is the button that is displayed and when clicked, the content is displayed. The className is set to "sort-select" to style the trigger. */}
      <SelectTrigger className="sort-select">
        {/* The value is the text that is displayed in the trigger. If the value is not set, it displays the placeholder. The placeholder is set to the default sort type. */}
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      {/* The content is the list of options that are displayed when the trigger is clicked. The className is set to "sort-select-content" to style the content. */}
      <SelectContent className="sort-select-content">
        {/* The select items are the options in the list. The key is set to the label of the sort type. The className is set to "shad-select-item" to style the item. The value is set to the value of the sort type. */}
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.label}
            className="shad-select-item"
            value={sort.value}
          >
            {/* The label is the text that is displayed in the item. */}
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default Sort;
