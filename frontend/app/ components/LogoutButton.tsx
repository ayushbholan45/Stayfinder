'use client';

import { useRouter } from "next/navigation";
import { resetAuthCookies } from '../lib/actions';
import MenuLink from "./navbar/MenuLink";
import useToast from "@/app/hooks/useToast";

interface LogoutButtonProps {
    onClose: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClose }) => {
    const router = useRouter();
    const toast = useToast();

    const submitLogout = async () => {
        await resetAuthCookies();
        onClose();       
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