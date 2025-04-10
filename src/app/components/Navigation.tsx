"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import supabase from '../api/supabaseClient';
import { HomeOutlined, InfoCircleOutlined, MailOutlined, ShoppingCartOutlined, LoginOutlined, UserAddOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import Image from "next/image";

export default function Navigation() {
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserEmail(user && user.email ? user.email : null);
        };
        fetchUser();
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUserEmail(session?.user?.email ?? null);
            }
        );
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
    };

    return (
        <div style={headerStyles}>
            <div style={divStyles}>
                <Link href="/" style={getLinkStyle(pathname, "/")}>
                    <HomeOutlined /> Home
                </Link>
                <Link href="/about" style={getLinkStyle(pathname, "/about")}>
                    <InfoCircleOutlined /> About
                </Link>
                <Link href="/contact" style={getLinkStyle(pathname, "/contact")}>
                    <MailOutlined /> Contact
                </Link>
                <Link href="/orders" style={getLinkStyle(pathname, "/orders")}>
                    <ShoppingCartOutlined /> Orders
                </Link>
                <Link href="/login" style={getLinkStyle(pathname, "/login")}>
                    <LoginOutlined /> Login
                </Link>
                <Link href="/signup" style={getLinkStyle(pathname, "/signup")}>
                    <UserAddOutlined /> Sign Up
                </Link>
            </div>
            {userEmail && (
                <div style={userDropdownContainerStyles} ref={dropdownRef}>
                    <div
                        style={welcomeStyles}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        Welcome, {userEmail}
                        <Image src="/dropdown.png" alt="Dropdown icon" width={12} height={12} style={{marginLeft: '5px'}} />
                    </div>
                    {dropdownOpen && (
                        <div style={dropdownMenuStyles}>
                            <Link href="/editaccount" style={dropdownItemStyles}>
                                <EditOutlined /> Edit Account
                            </Link>
                            <div
                                style={dropdownItemStyles}
                                onClick={handleLogout}
                            >
                                <LogoutOutlined /> Log Out
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    width: "100%",
};

const divStyles = {
    display: "flex",
    gap: "40px",
    color: "white",
    alignItems: "center"
};

const userDropdownContainerStyles = {
    position: "relative" as const,
    marginRight: "70px",
};

const welcomeStyles = {
    color: "#091E31FF",
    fontSize: "18px",
    cursor: "pointer",
};

const dropdownMenuStyles = {
    position: "absolute" as const,
    top: "100%",
    right: "0",
    backgroundColor: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    padding: "8px 0",
    zIndex: 1000,
    minWidth: "160px",
};

const dropdownItemStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    color: "#091E31FF",
    textDecoration: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
        backgroundColor: "#f5f5f5",
    },
};

const getLinkStyle = (pathname: string, href: string) => ({
    color: pathname === href ? "#52c41a" : "#091E31FF",
    textDecoration: "none",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});