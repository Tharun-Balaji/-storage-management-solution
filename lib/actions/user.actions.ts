"use server";

import { ID, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
import { avatarPlaceholderUrl } from "@/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// **Create account flow**
// 1.User enters full name and email(we will use this to identify if we still need to create a user)
// 2.check if user already exists using the email
// 3.send otp to user's email

// 1. This will send a secrete key for creating a session. the secrete key or otp will be sent to users email
// 4. create a new user if user is new user
// 5. return the users accountId that will be used to complete the login later with otp
// 6. verify the otp and authenticate to login

/**
 * Check if a user already exists using their email
 * @param email The email to check
 * @returns The user document if the user exists, null otherwise
 */
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient(); //  Connect to the database

  // Query the users collection for a document with the given email
  const result = await databases.listDocuments(
    appwriteConfig.databaseId, // The database ID
    appwriteConfig.usersCollectionId, // The collection ID
    [Query.equal("email", [email])] // The query
  );

  // Return the user document if the user exists, null otherwise
  return result.total > 0 ? result.documents[0] : null;
};

/**
 * Logs the given error and message to the console and re-throws the error
 * to be handled by the caller.
 * @param error The error to log and re-throw
 * @param message The message to log
 */
const handleError = (error: unknown, message: string) => {
  // Log the error and message to the console
  console.log(error, message);

  // Throw the error to be handled by the caller
  throw error;
};

/**
 * Sends an email OTP to the given email address. This OTP is used to create a session in the future.
 * @param email The email address to send the OTP to
 * @returns The user ID of the user who the OTP was sent to
 */
const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    // Create a session token for the given email address
    const session = await account.createEmailToken(ID.unique(), email);

    // Return the user ID of the user who the OTP was sent to
    return session.userId;
  } catch (error) {
    // Log the error and message to the console and re-throw the error
    handleError(error, "Failed to send email OTP");
  }
};


/**
 * Creates a new user account or re-sends an OTP if the user already exists.
 * @param {Object} data
 * @param {string} data.fullName - The full name of the user
 * @param {string} data.email - The email of the user
 * @returns {Promise<string>} The user ID of the user who was either created or had an OTP sent
 */
const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
  }) => {
  // Check if the user already exists using their email
  const existingUser = await getUserByEmail(email);

  // Send an OTP to the user to create a session
  const accountId = await sendEmailOTP({ email });

  // If the OTP was not sent, throw an error
  if (!accountId) throw new Error("Failed to send an OTP");

  // If the user does not exist, create a new user document
  if (!existingUser) {
    const { databases } = await createAdminClient();

    // Create a new document in the users collection
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    );
  }

  // Return the user ID
  return parseStringify({ accountId });
};

/**
 * Verifies the given secret(OTP) and logs the user in by creating a session cookie
 * @param {Object} data
 * @param {string} data.accountId - The account ID of the user to log in
 * @param {string} data.password - The secret(OTP) to verify
 * @returns {Promise<string>} The session ID of the user who was logged in
 */
const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    // Connect to the Appwrite server using the admin client
    const { account } = await createAdminClient();

    // Create a new session for the given account ID and secret(OTP)
    const session = await account.createSession(accountId, password);

    // Set the session cookie on the client
    // This will be used to authenticate the user on future requests
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // Return the session ID
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    // If there's an error, log the error and message to the console and re-throw the error
    handleError(error, "Failed to verify OTP");
  }
};

/**
 * Gets the current user by first getting the user's account ID from the session
 * and then querying the users collection with that account ID
 * @returns {Promise<Object | null>} The user document if the user exists, null otherwise
 */
const getCurrentUser = async () => {
  try {
    // Connect to the Appwrite server using the session client
    const { databases, account } = await createSessionClient();

    // Get the user's account ID from the session
    const result = await account.get();

    // Query the users collection for a document with the given account ID
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    // If the user does not exist, return null
    if (user.total <= 0) return null;

    // Return the user document
    return parseStringify(user.documents[0]);
  } catch (error) {
    // Log the error to the console
    console.log(error);
  }
};

/**
 * Signs out the current user by deleting the user's session from the Appwrite
 * server and deleting the session cookie from the client.
 *
 * @returns {Promise<void>} A promise that resolves when the user is signed out
 */
const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    // Delete the user's session from the Appwrite server
    await account.deleteSession("current");

    // Delete the session cookie from the client
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    // If there's an error, log the error and message to the console
    handleError(error, "Failed to sign out user");
  } finally {
    // Redirect the user to the sign in page after signing out
    redirect("/sign-in");
  }
};

 const signInUser = async ({ email }: { email: string }) => {
  try {
    // Check if the user already exists using their email
    const existingUser = await getUserByEmail(email);

    // If user exists, send an OTP to the user's email
    if (existingUser) {
      await sendEmailOTP({ email });
      // Return the user's account ID for further processing
      return parseStringify({ accountId: existingUser.accountId });
    }

    // If user does not exist, return an error message
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    // Handle any errors that occur during the sign-in process
    handleError(error, "Failed to sign in user");
  }
};

export {
  createAccount,
  verifySecret,
  sendEmailOTP,
  getCurrentUser,
  signOutUser,
  signInUser
};
 
