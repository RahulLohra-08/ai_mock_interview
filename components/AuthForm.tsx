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
import {signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signInWithGoogle, signUp } from "@/lib/auth.action"

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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    try {
      if(type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password); //client ka denge.

        console.log("User credentials from Firebase:", userCredentials);
        if(!userCredentials.user) {
          toast.error("Signup failed, please try again");
          return;
        }
        
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!, //typescript ko batana hai ki ye null nahi hoga
          email,
          password,
        })  //server ka denge

        console.log("Sign-up result from server action:", result);
        if(!result?.success){
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully!");
        // Redirect to sign-in page after successful sign-up
        router.push("/sign-in");
      } else {

        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredentials.user.getIdToken();

        // 👇 call your server action to set session cookie
        const result = await signIn({ email, idToken });

        console.log("Sign-in result:", result);


        // if(!idToken){
        //   toast.error("Signin failed, please try again");
        //   return;
        // }

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success(result.message);

        // toast.success(userCredentials.user.email + ` signed in successfully!`);
        // Redirect to home page after successful sign-in
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`There was an error: ${error}`);
    }
    // ✅ This will be type-safe and validated.
  }


  //google login
  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    const idToken = await user.getIdToken();

    // Call your server action (same way you handle email sign-in)
    const res = await signInWithGoogle({ idToken });
    

    if (!res?.success) {
      toast.error(res?.message);
      return;
    }

    toast.success("Signed in with Google!");
    router.push("/");
  } catch (error: any) {
    console.error("Google login error:", error);
    toast.error(error.message);
  }
};


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
        { isSignIn && <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mt-2"
            onClick={handleGoogleLogin}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
        }        {/* Link to switch between sign-in and sign-up */}

        <p className="text-center">
          {isSignIn ? "Not account yet?" : "Already have an account?"}{" "}
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-bold text-user-primary ml-1">{isSignIn ? "Sign Up" : "Sign In"}</Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm