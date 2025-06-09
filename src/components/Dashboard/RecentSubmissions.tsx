import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Submission {
  id: string;
  date: string;
  title: string;
  platforms: string[];
  status: "completed" | "in-progress" | "failed";
}

interface RecentSubmissionsProps {
  submissions?: Submission[];
}

const RecentSubmissions = ({
  submissions = defaultSubmissions,
}: RecentSubmissionsProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter((submission) => {
      if (filter === "all") return true;
      return submission.platforms.includes(filter);
    })
    .filter((submission) => {
      if (!search) return true;
      return submission.title.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-500">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
            In Progress
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-500">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      Facebook: "bg-blue-600/20 text-blue-400",
      LinkedIn: "bg-blue-800/20 text-blue-300",
      Twitter: "bg-sky-500/20 text-sky-300",
      Instagram: "bg-purple-500/20 text-purple-300",
      Blog: "bg-orange-500/20 text-orange-300",
    };

    return (
      <Badge
        key={platform}
        variant="outline"
        className={`mr-1 ${colors[platform] || "bg-gray-500/20 text-gray-300"}`}
      >
        {platform}
      </Badge>
    );
  };

  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-gray-800 shadow-lg overflow-hidden">
      <CardHeader className="border-b border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl text-white">
            Recent Submissions
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[130px] bg-gray-900/60 border-gray-700">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] bg-gray-900/60 border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900/60 border-gray-700 text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-900/50">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Title</TableHead>
                <TableHead className="text-gray-400">Platforms</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-gray-800 hover:bg-gray-900/50"
                  >
                    <TableCell className="text-gray-300">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              {new Date(submission.date).toLocaleDateString()}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {new Date(submission.date).toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {submission.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {submission.platforms.map((platform) =>
                          getPlatformBadge(platform),
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-400"
                  >
                    No submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center p-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            View All Submissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Default mock data
const defaultSubmissions: Submission[] = [
  {
    id: "1",
    date: "2023-06-15T10:30:00Z",
    title: "Top 10 Digital Marketing Trends for 2023",
    platforms: ["Facebook", "LinkedIn", "Twitter", "Blog"],
    status: "completed",
  },
  {
    id: "2",
    date: "2023-06-14T14:45:00Z",
    title: "How AI is Transforming Content Creation",
    platforms: ["LinkedIn", "Twitter", "Blog"],
    status: "completed",
  },
  {
    id: "3",
    date: "2023-06-13T09:15:00Z",
    title: "Social Media Strategies for Small Businesses",
    platforms: ["Facebook", "Instagram", "LinkedIn"],
    status: "in-progress",
  },
  {
    id: "4",
    date: "2023-06-12T16:20:00Z",
    title: "The Future of Remote Work",
    platforms: ["LinkedIn", "Blog"],
    status: "failed",
  },
  {
    id: "5",
    date: "2023-06-11T11:00:00Z",
    title: "Building Your Personal Brand Online",
    platforms: ["Twitter", "Instagram", "LinkedIn"],
    status: "completed",
  },
];

export default RecentSubmissions;
