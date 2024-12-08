"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

type FormType = "sign-in" | "sign-up";

  /**
   * Defines the schema for the authentication form based on the type of form.
   * For sign-up, the full name is required, while for sign-in, it is optional.
   * @param {FormType} formType - The type of form. Either "sign-in" or "sign-up".
   * @returns {import("zod").ZodObject} The schema for the authentication form.
   */
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};


/**
 * A form component for user authentication.
 * Handles sign-in and sign-up form validation and submission.
 * Depending on the type of form, either creates a new user or signs in an existing one.
 * If the form is submitted successfully, displays an OTP modal for account verification.
 * @param {FormType} type - The type of form. Either "sign-in" or "sign-up".
 * @returns {JSX.Element} The authentication form component.
 */
export default function AuthForm({ type }: { type: FormType }) {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  // Handles form submission.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Mark the form as loading to prevent multiple submissions.
    setIsLoading(true);
    // Clear any existing error messages.
    setErrorMessage("");

    try {
      // Depending on the type of form, either create a new user or sign in an existing one.
      // Depending on the type of form, either create a new user or sign in an existing one.
      // For sign-up, create a new user with the provided full name and email.
      // For sign-in, try to find an existing user with the provided email.
      const user = type === "sign-up"
        ? await createAccount({
            fullName: values.fullName || "",
            email: values.email,
          })
        : await signInUser({ email: values.email });
      
      // Save the user's account ID to the state.
      // This is used to log the user in after the account is created.
      setAccountId(user.accountId);
    } catch {
      // If there's an error, display an error message.
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      // Mark the form as not loading when the submission is complete.
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Form component to handle the form state and submission */}
      <Form {...form}>
        {/* HTML form element with a submission handler */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          {/* Form title based on the form type */}
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>

          {/* Conditional rendering for 'sign-up' form fields */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>

                  {/* Displays validation message for full name */}
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {/* Email input field with validation message */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* Submit button with loading state */}
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}

            {/* Loader icon when the form is submitting */}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {/* Display error message if any */}
          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          {/* Navigation links for switching between sign-in and sign-up */}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {/* OTP Modal for account verification */}
      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
}
