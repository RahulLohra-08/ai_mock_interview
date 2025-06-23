"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3).max(50) : z.string(),
    email: z.string().email(),
    password: z.string().min(3),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {

  const router = useRouter();
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    try {
      if(type === "sign-up") {
        console.info("SIGN UP: ", values);
        toast.success("Account created successfully!");
        // Redirect to sign-in page after successful sign-up
        router.push("/sign-in");
      } else {
        console.info("SIGN IN: ", values);
        toast.success("Signed in successfully!");
        // Redirect to home page after successful sign-in
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`There was an error: ${error}`);
    }
    // ✅ This will be type-safe and validated.
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src='/logo.svg' alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3> Practice job interview with AI</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
                type="text"
              />
            )}
            <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />
            <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
            <Button type="submit" className="btn">{isSignIn ? "Sign In" : "Create an Account"}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Not account yet?" : "Already have an account?"}{" "}
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-bold text-user-primary ml-1">{isSignIn ? "Sign Up" : "Sign In"}</Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm