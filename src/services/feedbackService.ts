import { GeneralFeedbackModel, GeneralFeedbackClass } from "../models/Feedback";
import { DocumentType } from "@typegoose/typegoose";

/**
 * Interface for the data needed to create a new feedback entry.
 */
export interface CreateFeedbackData {
  title: string;
  description: string;
  images?: string[]; 
  submittedBy: string; // The ID of the user submitting the feedback (Required by model)
}

// -------------------------------------------------------------------
// SERVICE FUNCTIONS
// -------------------------------------------------------------------

/**
 * Creates a new feedback entry in the database.
 * @param feedbackData The data for the new feedback entry.
 * @returns The newly created feedback document.
 */
export const createGeneralFeedback = async (
  feedbackData: CreateFeedbackData
): Promise<DocumentType<GeneralFeedbackClass>> => {
  const newFeedback = await GeneralFeedbackModel.create(feedbackData);
  return newFeedback;
};

/**
 * Retrieves all feedback entries, sorted by creation date.
 * Populates the 'submittedBy' field with selected user details.
 * @returns An array of feedback documents.
 */
export const listGeneralFeedback = async (): Promise<
  DocumentType<GeneralFeedbackClass>[]
> => {
  const feedbackList = await GeneralFeedbackModel.find()
    .sort({ createdAt: -1 }) // Sorts descending by creation date
    .populate("submittedBy", "username email") // Populates the reference
    .exec();

  return feedbackList;
};

// You can add getFeedbackById, updateFeedback, and deleteFeedback functions here as well.