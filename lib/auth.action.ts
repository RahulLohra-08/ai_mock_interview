//make sure its render in as server side
//this file is for authentication actions
'use server';
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7; //in seconds

export async function signInWithGoogle({ idToken }: { idToken: string }) {
    console.log("Signing in with Google:", { idToken });
  try {
    const decoded = await auth.verifyIdToken(idToken);

    console.log("Decoded Google ID token:", decoded);

// 2️⃣ Create session cookie
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ONE_WEEK * 1000, // milliseconds
    });

    // 3️⃣ Set cookie
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      maxAge: ONE_WEEK,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // At this point, user is verified.
    // You can create a session cookie or fetch user from Firestore
    return { success: true, message: "Login successful!" };
  } catch (err) {
    console.error("Error verifying Google token:", err);
    return { success: false, message: "Invalid login attempt." };
  }
}


export async function signUp(params: SignUpParams) { //type SignUpParams defined in types/index.d.ts
    const {uid, name, email } = params;

    try {
        console.log("Signing up user with params:", params);
        if (!uid) {
            throw new Error("UID is missing before fetching Firestore user");
        }

        //Sign up user using firebase admin sdk
        //First fetch the user by email to check if user already exists
        const userRecord = await db.collection('users').doc(uid).get(); //fetch user by uid from firestore document
        console.log("User record fetched during sign-up:", userRecord);
        if(userRecord.exists){
            return{
                success: false,
                message: "User already exists. Pls sign in instead" //This message will be shown to user
            }
        }

        //If user does not exist, create a new user document in firestore
        await db.collection('users').doc(uid).set({
            name,
            email,
        });

        return{
            success: true,
            message: "User created successfully, you can now sign in."
        }

    } catch (error: any) {
        console.log('Error creating user:', error);
        
        //Firebase errors have a code property
        if(error.code === "auth/email-already-in-use"){
            return{
                success: false,
                message: "Email already in use"
            }
        }

        //return another error message
        return{
            success: false,
            message: "Failed to create an account" //This is a general error message
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        //Verify the ID token using Firebase Admin SDK
        const userRecord = await auth.getUserByEmail(email);
        console.log("User record fetched during sign-in:", userRecord);

        if(!userRecord){
            return{
                success: false,
                message: "User does not exist. Create an account instead"
            }
        }
        console.log("User record exists, proceeding to set session cookie.", idToken);
        //Set session cookie
        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Signed in successfully",
            user: { uid: userRecord.uid, email: userRecord.email },
        };

    } catch (error) {
        console.error("Error signing in:", error);
        return{
            success: false,
            message: "Failed to sign in into an account"
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();  //to set cookies server side
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000, //firebase expects in milliseconds
    });

    //Set cookie
    cookieStore.set('session', sessionCookie, {
        httpOnly: true, //client side js cannot access this cookie)
        maxAge: ONE_WEEK, //in seconds
        path: '/', //all paths
        secure: process.env.NODE_ENV === 'production', //only sent over https
        sameSite: 'lax', //csrf protection matlb same site se hi request aayegi
    });
}

export async function getCurrentUser(): Promise<User | null> { //type User defined in types/index.d.ts
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value; //?.value because cookieStore.get returns {name, value, path, ...} or undefined

    if(!sessionCookie) return null;
    console.log("Session Cookie:", sessionCookie);

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); //true means check if revoked
        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();

        if(!userRecord.exists) return null;
        
        return {
            ...userRecord.data(),
            id: userRecord.id,
            name: userRecord.data()?.name,
            email: userRecord.data()?.email,
        } as User; //type assertion

    }catch(error:any){
        console.error("Error fetching current user:", {
            message: error?.message,
            code: error?.code,
            stack: error?.stack,
            raw: error
        });
        return null;
    }
}

export const isAuthenticated = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return !!user; //return true if user exists, else false
}