"use server"
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export default async function GetMytoken(){

const decodedToken= ((await cookies()).get("next-auth.session-token")?.value)|| 
((await cookies()).get("__Secure-next-auth.session-token")?.value);
if(!decodedToken){
    return undefined
}
 const token = await decode({token :decodedToken ,secret:process.env.NEXTAUTH_SECRET})
 return token?.accessToken
}