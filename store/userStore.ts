import { create } from 'zustand';


interface UserStore{
    isAdmin: boolean;
    setIAdmin:(value:boolean)=>void
}

export const useUserStore=create<UserStore>(set=>({
    isAdmin:false,
    setIAdmin:(value)=> set({isAdmin:value})
})) 