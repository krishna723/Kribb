import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import { useUserSync } from "../../../hooks/useUserSync";

export default function Index() {

  const {isSignedIn, isLoaded}=useAuth()

  //sync Clerk user -> Supabase 

  useUserSync()

  if(!isLoaded) return null;

  if(!isSignedIn) return <Redirect href ="/sign-in"/>;

  return <Slot screenOptions={{headerShown: false}}/>

  
 
}