'use client';

import { useRouter } from "next/navigation";
import { resetAuthCookies } from '../lib/actions';
import MenuLink from "./navbar/MenuLink";
import useToast from "@/app/hooks/useToast";

const LogoutButton: React.FC = () => {
    const router = useRouter();
    const toast = useToast();

    const submitLogout = async () => {
        await resetAuthCookies();
        toast.show('Successfully logged out!');
        router.push('/');
    }

    return (
        <MenuLink
            label="Log out"
            onClick={submitLogout}
        />
    )
}

export default LogoutButton;