"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from '../api/supabaseClient';
import { HomeOutlined, InfoCircleOutlined, MailOutlined, ShoppingCartOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";

export default function Navigation() {
    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState<string | null>(null);

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
                <div style={welcomeStyles}>
                    Welcome, {userEmail}
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

const welcomeStyles = {
    color: "#091E31FF",
    fontSize: "18px",
    marginRight: "70px",
};

const getLinkStyle = (pathname: string, href: string) => ({
    color: pathname === href ? "#52c41a" : "#091E31FF",
    textDecoration: "none",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
});
