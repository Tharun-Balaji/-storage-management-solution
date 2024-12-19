
# Store it - Storage Management Platform

A modern storage management and file sharing platform built with Next.js 15 and Appwrite. Upload, organize, and share files effortlessly with a clean, responsive interface.

## Table of Contents
- [Preview](#preview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Core Implementation](#core-implementation)
  - [Appwrite Session Management](#appwrite-session-management)
  - [File Operations](#file-operations)
  - [User Authentication](#user-authentication)
- [Live Demo](#live-demo)

## 🖼️ Preview

### Login Page
![Login Page](image.png)

### signup Page
![Signup Page](image-1.png)

### OTP mail
![OTP Mail](image-2.png)

### Entering OTP
![OTP Input](image-3.png)

### Uploading file
![Uploading File](image-4.png)

### Dashboard
![Dashboard](image-5.png)



Live Demo: [Store it Platform](https://storage-management-solution-iota.vercel.app/)

## Features
- 👉 **User Authentication with Appwrite**: Secure signup, login, and logout functionality
- 👉 **File Uploads**: Support for multiple file types (documents, images, videos, audio)
- 👉 **File Management**: View, rename, and delete files stored in Appwrite storage
- 👉 **Download Capabilities**: Easy file download access
- 👉 **File Sharing**: Collaborative file sharing with other users
- 👉 **Dynamic Dashboard**: Shows total/consumed storage, recent uploads, and file type summaries
- 👉 **Global Search**: Quick file and shared content search
- 👉 **Advanced Sorting**: Organize files by date, name, or size
- 👉 **Responsive Design**: Clean, modern UI that works across all devices

## Tech Stack
- React 19
- Next.js 15
- Appwrite
- TailwindCSS
- ShadCN
- TypeScript

## Getting Started

### Prerequisites
- Node.js and npm installed
- Appwrite account and project setup

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Tharun-Balaji/storage-management-solution.git
cd storage-management-solution
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see below)

4. Run the development server:
```bash
npm run dev
```

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT=""
NEXT_PUBLIC_APPWRITE_DATABASE=""
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=""
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=""
NEXT_PUBLIC_APPWRITE_BUCKET=""
NEXT_APPWRITE_KEY=""
```

## Project Structure

## app/
* **auth/**
  * **sign-in/**
    * `page.tsx`: Handles the sign-in page logic and UI.
  * **sign-up/**
    * `page.tsx`: Handles the sign-up page logic and UI.
  * `layout.tsx`: Shared layout for authentication pages.
* **root/**
  * `[type]`: Dynamic route for different content types (e.g., posts, users).
    * `page.tsx`: Renders the content based on the dynamic route parameter.
  * `layout.tsx`: Shared layout for root-level pages.
  * `page.ts`: Data fetching logic for the root page.

## components/
* **ActionDropdown.tsx**: Reusable dropdown component for actions.
* **ActionsModalContent.tsx**: Modal content for various actions.
* **Card.tsx**: Generic card component for displaying information.
* **FileUploader.tsx**: File upload component.
* **Header.tsx**: Header component for the application.
* **MobileNavigation.tsx**: Navigation component for mobile devices.
* **Search.tsx**: Search component.
* **Sidebar.tsx**: Sidebar component for navigation.
* **Thumbnail.tsx**: Thumbnail component for images.
* **ui/**: Shared UI components from Shadcn.

## lib/
* **actions/**: Action creators and utility functions.
  * `file.actions.ts`: Actions related to file operations.
  * `user.actions.ts`: Actions related to user operations.
* **appwrite/**: Appwrite configuration and integration.
  * `config.ts`: Appwrite configuration settings.
  * `index.ts`: Main Appwrite client instance.
  * `utils.ts`: Utility functions for interacting with Appwrite.
* **utils.ts**: General utility functions.

## hooks/
* **use-toast.ts**: Custom hook for displaying toast notifications.

## types/
* **index.d.ts**: Global type definitions.

## constants/
* **index.ts**: Global constants.

## Core Implementation

### Appwrite Session Management
```typescript
"use server";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) throw new Error("No session");
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};
```

### File Operations
```typescript
const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owners: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument
    );

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
```

### User Authentication
```typescript
const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();
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

  return parseStringify({ accountId });
};
```

## Live Demo
Check out the live demo at [https://storage-management-solution-iota.vercel.app/](https://storage-management-solution-iota.vercel.app/)

For more details and source code, visit the [GitHub Repository](https://github.com/Tharun-Balaji/storage-management-solution.git)