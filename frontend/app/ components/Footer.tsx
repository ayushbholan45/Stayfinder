import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white mt-auto">
            <div className="max-w-400 mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Stayfinder logo"
                            width={140}
                            height={30}
                        />
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <Link href="/" className="hover:text-stayfinder transition">Home</Link>
                        <Link href="/myreservations" className="hover:text-stayfinder transition">Reservations</Link>
                        <Link href="/myfavorites" className="hover:text-stayfinder transition">Favorites</Link>
                        <Link href="/myproperties" className="hover:text-stayfinder transition">My properties</Link>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Stayfinder. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;