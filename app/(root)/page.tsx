import Chart from "@/components/Chart";
import Link from "next/link";
import FormattedDateTime from "@/components/FormattedDateTime";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import ActionDropdown from "@/components/ActionDropdown";
import Thumbnail from "@/components/Thumbnail";
import { Models } from "node-appwrite";

/**
 * Dashboard component that displays a summary of file usage and recent uploads.
 * Fetches files and total space used in parallel and calculates the usage summary.
 * Displays a chart of used storage and a list of file type summaries.
 * Also shows a section for recent files uploaded with details and actions.
 * 
 * @returns A JSX element representing the dashboard component.
 */

async function Dashboard() {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section>
        {/* Chart displaying used storage */}
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        {/* Recent files uploaded section header */}
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>

        {/* No files uploaded fallback */}
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                {/* Thumbnail representing the uploaded file */}
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                {/* File details */}
                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    {/* File name */}
                    <p className="recent-file-name">{file.name}</p>

                    {/* File upload date */}
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  {/* File dropdown actions */}
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
