import { UserModel, UserClass } from "../models/User";
import { DocumentType } from "@typegoose/typegoose";
import bcrypt from "bcrypt";

/**
 * Interface for the required user data for registration.
 */
export interface UserSignupData {
  username: string;
  email: string;
  password?: string; // Note: Service expects plain password, Controller handles validation
}

/**
 * Interface for the minimal user details returned to the client.
 */
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
}

/**
 * Hashes a plain text password.
 * @param password The plain text password.
 * @returns The hashed password string.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Finds a user by email or username to check for existence.
 * @param email The user's email.
 * @param username The user's username.
 * @returns The user document or null.
 */
export const findUserByEmailOrUsername = async (
  email: string,
  username: string
): Promise<DocumentType<UserClass> | null> => {
  return UserModel.findOne({ $or: [{ email }, { username }] }).exec();
};

/**
 * Creates a new user in the database.
 * @param userData The user data including the hashed password.
 * @returns The created user document.
 */
export const createUser = async (
  userData: UserSignupData & { password: string } // Ensure password is now hashed
): Promise<DocumentType<UserClass>> => {
  return UserModel.create(userData);
};

/**
 * Finds a user by email for login purposes.
 * @param email The user's email.
 * @returns The user document including the password hash, or null.
 */
export const findUserByEmail = async (
  email: string
): Promise<DocumentType<UserClass> | null> => {
  return UserModel.findOne({ email }).exec();
};

/**
 * Compares a plain password with a stored hash.
 * @param plainPassword The password submitted by the user.
 * @param hashedPassword The hash stored in the database.
 * @returns True if passwords match, false otherwise.
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Maps a UserClass document to a public UserProfile object.
 * @param userDoc The user document.
 * @returns A profile object suitable for sending to the client.
 */
export const mapToUserProfile = (
  userDoc: DocumentType<UserClass>
): UserProfile => {
  return {
    _id: userDoc._id.toString(),
    username: userDoc.username,
    email: userDoc.email,
  };
};