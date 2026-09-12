import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClearkSupabaseClient } from "../lib/supabase";

export function useSupabase(){
    const {getToken}=useAuth()

    const client = useMemo(
        ()=>createClearkSupabaseClient(()=>getToken()),
        [getToken],
    )
    return client
}