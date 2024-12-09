
import { cn, formatDateTime } from '@/lib/utils';

/**
 * Formats a date string into a human-readable format
 *
 * @param date - date string in ISO format
 * @param className - optional class name to add to the element
 * @returns A paragraph element with the formatted date string
 */
function FormattedDateTime({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  return (
    <p className={cn("body-1 text-light-200", className)}>
      {formatDateTime(date)}
    </p>
  );
}

export default FormattedDateTime;