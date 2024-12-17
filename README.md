This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


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


app/
  (auth)
    /sign-in
      page.tsx
    /sign-up
      page.tsx
    layout.tsx
  (root)
    [type]
      page.tsx
    layout.tsx
    page.ts
/public
  /assets
components/
  ActionDropdown.tsx
  ActionsModalContent.tsx
  Card.tsx
  FileUploader.tsx
  Header.tsx
  MobileNavigation.tsx
  Search.tsx
  Sidebar.tsx
  Thumbnail.tsx
  ui/ # shadcn components
    button.tsx
    dialog.tsx
    dropdown-menu.tsx
    input.tsx
    sheet.tsx
    toast.tsx
    ...
lib/
  actions/
    file.actions.ts
      export {uploadFile,getFiles,renameFile,updateFileUsers,deleteFile};
    user.actions.ts
      export {createAccount,verifySecret,sendEmailOTP,getCurrentUser,signOutUser,signInUser};
  appwrite/
    config.ts
    index.ts
  utils.ts
hooks/
  use-toast.ts
types/
  index.d.ts
constants/
  index.ts
