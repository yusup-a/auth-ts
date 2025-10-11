import { FeatureRequestModel, FeatureRequestClass } from "../models/FeatureRequest";
import { DocumentType } from "@typegoose/typegoose";

/**
 * Interface for the data needed to create or update a feature request.
 */
export interface CreateFeatureRequestData {
  title: string;
  description: string;
  priority: "Nice-to-have" | "Important" | "Critical";
  images?: string[]; 
  targetAudience?: string;
  expectedBenefit?: string;
  submittedBy: string; // User ID string (required by model)
}

// --- Service Functions ---

/**
 * Creates a new feature request in the database.
 * @param requestData The data for the new feature request.
 * @returns The newly created feature request document.
 */
export const createFeatureRequest = async (
  requestData: CreateFeatureRequestData
): Promise<DocumentType<FeatureRequestClass>> => {
  const newRequest = await FeatureRequestModel.create(requestData);
  return newRequest;
};

/**
 * Retrieves all feature requests, sorted by the latest creation date.
 * Populates the 'submittedBy' field.
 * @returns An array of feature request documents.
 */
export const listFeatureRequests = async (): Promise<
  DocumentType<FeatureRequestClass>[]
> => {
  const requests = await FeatureRequestModel.find()
    .sort({ createdAt: -1 })
    .populate("submittedBy", "username email")
    .exec();
  return requests;
};

/**
 * Retrieves a single feature request by its ID.
 * @param id The ID of the feature request.
 * @returns The feature request document, or null if not found.
 */
export const getFeatureRequestById = async (
  id: string
): Promise<DocumentType<FeatureRequestClass> | null> => {
  const request = await FeatureRequestModel.findById(id)
    .populate("submittedBy", "username email")
    .exec();
  return request;
};

/**
 * Updates an existing feature request.
 * @param id The ID of the feature request to update.
 * @param updateData The fields to update (partial data).
 * @returns The updated feature request document, or null if not found.
 */
export const updateFeatureRequest = async (
  id: string,
  updateData: Partial<CreateFeatureRequestData>
): Promise<DocumentType<FeatureRequestClass> | null> => {
  const updatedRequest = await FeatureRequestModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).exec();
  return updatedRequest;
};
