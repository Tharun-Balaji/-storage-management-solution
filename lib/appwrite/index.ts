"use server";
import { Account, Client, Databases } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

/**
 * Creates an Appwrite client with the session set from the session cookie.
 *
 * This function throws an error if the session cookie is not set.
 *
 * @returns An Appwrite client with the session set and shortcuts to the
 * Account and Databases services.
 */
export const createSessionClient = async () => { 
  // Create an Appwrite client instance
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // The Appwrite endpoint
    .setProject(appwriteConfig.projectId); // The Appwrite project ID

  // Get the session cookie
  const session = (await cookies()).get("appwrite-session");

  // If there is no session cookie, throw an error
  if (!session || !session.value) throw new Error("No session");

  // Set the session on the client
  client.setSession(session.value);

  // Return a client with methods for the Account and Databases services
  return {
    // A shortcut to the Account service
    get account() {
      return new Account(client);
    },
    // A shortcut to the Databases service
    get databases() {
      return new Databases(client);
    },
  };

};