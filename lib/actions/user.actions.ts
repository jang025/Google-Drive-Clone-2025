// create account flow
// 1. user enters full name and email
// 2. check if the user already exists (by checking their email)
// 3. Send otp to user's email
// 4. send a secret key for creating a new session
// 5. create a new user document if the user is a new user
// 6. return the user's acccountId that will be used to complete the login
// 7. Verify the otp to authenticate the login

// must be run on the server side and not the client side
// server actions

"use server";
import { ID, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

export const getUserByEmail = async (email: string) => {
  // get access to the database
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

// export const sendEmailOTP = async ({
//   userId,
//   email,
// }: {
//   userId: string;
//   email: string;
// }) => {
//   const { account } = await createAdminClient();

//   try {
//     await account.createEmailToken(userId, email); // Changed: Use actual userId
//     return userId; // Changed: Return the existing userId
//   } catch (error) {
//     handleError(error, "Failed to send email OTP");
//   }
// };

export const createAccount = async ({
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
        avatar:
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};
