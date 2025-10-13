import { BugReportModel, BugReportClass } from "../models/BugReport";
import { DocumentType } from "@typegoose/typegoose";

export interface CreateBugReportData {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  images: string[];
  browser?: string;
  reproducibleSteps?: string;
  submittedBy?: string; // User ID string
}

/**
 * Creates a new bug report in the database.
 */
export const createBugReport = async (
  reportData: CreateBugReportData
): Promise<DocumentType<BugReportClass>> => {
  const newReport = await BugReportModel.create(reportData);
  return newReport;
};

/**
 * Retrieves all bug reports, sorted by the latest creation date.
 */
export const listBugReports = async (): Promise<
  DocumentType<BugReportClass>[]
> => {
  const reports = await BugReportModel.find()
    .sort({ createdAt: -1 }) 
    .populate("submittedBy", "username email") 
    .exec();

  return reports;
};


export const getBugReportById = async (
    id: string
): Promise<DocumentType<BugReportClass> | null> => {
    return BugReportModel.findById(id).exec();
};
