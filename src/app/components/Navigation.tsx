"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import supabase from '../api/supabaseClient';
import { Flex } from "antd";
import {
    HomeOutlined,
    InfoCircleOutlined,
    MailOutlined,
    ShoppingCartOutlined,
    LoginOutlined,
    UserAddOutlined,
    EditOutlined,
    LogoutOutlined,
    UserOutlined,
    DownOutlined,
    PushpinOutlined
} from "@ant-design/icons";

export default function Navigation() {
    const pathname = usePathname();
    const [userFirstName, setUserFirstName] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data } = await supabase
                    .from('userinfo')
                    .select('first_name')
                    .eq('id', user.id)
                    .single();
                if (data && data.first_name) {
                    setUserFirstName(data.first_name);
                } else {
                    setUserFirstName(user.email || "User");
                }
            }
        };
        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUserId(session.user.id);
                    const { data } = await supabase
                        .from('userinfo')
                        .select('first_name')
                        .eq('id', session.user.id)
                        .single();
                    if (data && data.first_name) {
                        setUserFirstName(data.first_name);
                    } else {
                        setUserFirstName(session.user.email || "User");
                    }
                } else {
                    setUserId(null);
                    setUserFirstName(null);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (userId) {
            const subscription = supabase
                .channel('userinfo-changes')
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'userinfo',
                    filter: `id=eq.${userId}`
                }, (payload) => {
                    if (payload.new && payload.new.first_name) {
                        setUserFirstName(payload.new.first_name);
                    }
                })
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [userId]);

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

    useEffect(() => {
        const index = tabRefs.current.findIndex((ref) => ref?.pathname === window.location.pathname);
        const currentRef = tabRefs.current[index];
        if (currentRef && indicatorRef.current) {
            const rect = currentRef.getBoundingClientRect();
            const containerRect = currentRef.offsetParent?.getBoundingClientRect();
            if (containerRect) {
                setIndicatorStyle({
                    width: `${rect.width}px`,
                    left: `${rect.left - containerRect.left}px`,
                });
            }
        }
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
        setUserFirstName(null);
        setUserId(null);
        window.location.href = "/"
    };

    return (
        <div style={headerStyles}>
            <div style={{ position: "relative", height: "36px", flex: 1 }}>
                <div style={navLinksStyles}>
                    <div
                        ref={indicatorRef}
                        style={{
                            position: "absolute",
                            height: "36px",
                            backgroundColor: "#52c41a",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            zIndex: 0,
                            ...indicatorStyle,
                        }}
                    ></div>

                    <Link
                        href="/home"
                        ref={(el) => (tabRefs.current[0] = el)}
                        style={getLinkStyle(pathname, "/")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ position: "relative", zIndex: 1 }}>
                            <HomeOutlined style={{ alignSelf: "start", bottom: "2px" }} />
                            Home
                        </Flex>
                    </Link>
                    <Link
                        href="/events"
                        ref={(el) => (tabRefs.current[1] = el)}
                        style={getLinkStyle(pathname, "/events")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ position: "relative", zIndex: 1 }}>
                            <PushpinOutlined style={{ alignSelf: "start", bottom: "2px" }} />
                            Events
                        </Flex>
                    </Link>
                    <Link
                        href="/about"
                        ref={(el) => (tabRefs.current[2] = el)}
                        style={getLinkStyle(pathname, "/about")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                            <InfoCircleOutlined /> About
                        </Flex>
                    </Link>

                    <Link
                        href="/orders"
                        ref={(el) => (tabRefs.current[3] = el)}
                        style={getLinkStyle(pathname, "/orders")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                            <ShoppingCartOutlined /> Orders
                        </Flex>
                    </Link>

                    {/* {!userFirstName && (
                        <>
                            <Link
                                href="/login"
                                ref={(el) => (tabRefs.current[4] = el)}
                                style={getLinkStyle(pathname, "/login")}
                            >
                                <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                                    <LoginOutlined /> Login
                                </Flex>
                            </Link>

                            <Link
                                href="/signup"
                                ref={(el) => (tabRefs.current[5] = el)}
                                style={getLinkStyle(pathname, "/signup")}
                            >
                                <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                                    <UserAddOutlined /> Sign Up
                                </Flex>
                            </Link>
                        </>
                    )} */}
                </div>
            </div>

            {userFirstName && (
                <div style={userDropdownContainerStyles} ref={dropdownRef}>
                    <div
                        style={welcomeStyles}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        Welcome, {userFirstName}
                        <DownOutlined style={{ fontSize: "8px" }} />
                    </div>
                    {dropdownOpen && (
                        <div style={dropdownMenuStyles}>
                            <Link href="/editaccount" style={dropdownItemStyles}>
                                <EditOutlined /> Edit Account
                            </Link>
                            <div style={dropdownItemStyles} onClick={handleLogout}>
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
    padding: "16px 32px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    borderBottom: "1px solid #e0e0e0",
    position: "sticky" as const,
    top: 0,
    zIndex: 999,
    minWidth: "1000px",
};

const navLinksStyles = {
    display: "flex",
    gap: "28px",
    flexWrap: "wrap" as const,
    alignItems: "center",
    position: "relative" as const,
};

const userDropdownContainerStyles = {
    position: "relative" as const,
    flexShrink: 0,
    minWidth: "fit-content",
    marginLeft: "auto",
};

const welcomeStyles = {
    color: "#333",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px"
};

const dropdownMenuStyles = {
    position: "absolute" as const,
    top: "110%",
    right: 0,
    backgroundColor: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "8px 0",
    zIndex: 1000,
    minWidth: "180px",
    maxWidth: "calc(100vw - 20px)",
    overflowX: "auto",
    animation: "fadeIn 0.3s ease-in-out",
};

const dropdownItemStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    color: "#333",
    textDecoration: "none",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontWeight: 400,
};

const getLinkStyle = (pathname: string, href: string) => ({
    color: pathname === href ? "#fff" : "#444",
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: pathname === href ? 600 : 400,
    zIndex: 1,
    padding: "0 12px",
    height: "36px",
    borderRadius: "8px",
    position: "relative" as const,
    transition: "color 0.2s ease",
});
