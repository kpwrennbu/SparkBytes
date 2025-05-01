"use client";

import Link from "next/link"; //Link from Next.js
import { usePathname } from "next/navigation"; //get the Link currently selected with this hook
import { useState, useEffect, useRef } from "react"; //react hook
import supabase from '../api/supabaseClient'; //supabase import
//AntdUI imports
import { Flex } from "antd";
import {
    HomeOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    LoginOutlined,
    UserAddOutlined,
    EditOutlined,
    LogoutOutlined,
    UserOutlined,
    DownOutlined,
    PushpinOutlined,
} from "@ant-design/icons";
import {
    headerStyles,
    navLinksStyles,
    userDropdownContainerStyles,
    welcomeStyles,
    avatarContainerStyles,
    avatarImageStyles,
    avatarPlaceholderStyles,
    dropdownMenuStyles,
    dropdownItemStyles,
    getLinkStyle,
  } from "../utils/navigation.utils";
  
import Image from "next/image";

export default function Navigation() {
    const pathname = usePathname(); //get current pathname
    const [userFirstName, setUserFirstName] = useState<string | null>(null); //path to hold users email;
    const [dropdownOpen, setDropdownOpen] = useState(false); //dropdown state
    const dropdownRef = useRef<HTMLDivElement>(null); // dropdown re state
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    // Sliding green background state
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    const [userId, setUserId] = useState<string | null>(null);

    //function to download the image
    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(path);

            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred while downloading the image");
            }
        }
        
    }
    //get the user's first name and avatar image
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data } = await supabase
                    .from('userinfo')
                    .select('first_name, avatar_url')
                    .eq('id', user.id)
                    .single();
                if (data) {
                    console.log("Got DATA: ", data)
                    setUserFirstName(data.first_name || user.email || "User");
                    if (data.avatar_url) {
                        downloadImage(data.avatar_url);
                    }
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
                        .select('first_name, avatar_url')
                        .eq('id', session.user.id)
                        .single();
                    if (data) {
                        setUserFirstName(data.first_name || session.user.email || "User");
                        if (data.avatar_url) {
                            downloadImage(data.avatar_url);
                        }
                    } else {
                        setUserFirstName(session.user.email || "User");
                    }
                } else {
                    setUserId(null);
                    setUserFirstName(null);
                    setAvatarUrl(null);
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
                    if (payload.new) {
                        if (payload.new.first_name) {
                            setUserFirstName(payload.new.first_name);
                        }
                        if (payload.new.avatar_url) {
                            downloadImage(payload.new.avatar_url);
                        }
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
    //Wellington can explain this more
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
    //function to logout the user
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
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
                        href="/"
                        ref={(el) => {tabRefs.current[0] = el}}
                        style={getLinkStyle(pathname, "/")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ position: "relative", zIndex: 1 }}>
                            <HomeOutlined style={{ alignSelf: "start", bottom: "2px" }} />
                            Home
                        </Flex>
                    </Link>
                    <Link
                        href="/events"
                        ref={(el) => {tabRefs.current[1] = el}}
                        style={getLinkStyle(pathname, "/events")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ position: "relative", zIndex: 1 }}>
                            <PushpinOutlined style={{ alignSelf: "start", bottom: "2px" }} />
                            Events
                        </Flex>
                    </Link>
                    <Link
                        href="/about"
                        ref={(el) => {tabRefs.current[2] = el}}
                        style={getLinkStyle(pathname, "/about")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                            <InfoCircleOutlined /> About
                        </Flex>
                    </Link>

                    <Link
                        href="/orders"
                        ref={(el) => {tabRefs.current[3] = el}}
                        style={getLinkStyle(pathname, "/orders")}
                    >
                        <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                            <ShoppingCartOutlined /> Orders
                        </Flex>
                    </Link>

                    {!userFirstName && (
                        <>
                            <Link
                                href="/login"
                                ref={(el) => {tabRefs.current[4] = el}}
                                style={getLinkStyle(pathname, "/login")}
                            >
                                <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                                    <LoginOutlined /> Login
                                </Flex>
                            </Link>

                            <Link
                                href="/signup"
                                ref={(el) => {tabRefs.current[5] = el}}
                                style={getLinkStyle(pathname, "/signup")}
                            >
                                <Flex justify="center" align="center" gap="8px" style={{ zIndex: 1 }}>
                                    <UserAddOutlined /> Sign Up
                                </Flex>
                            </Link>
                        </>
                    )}
                </div>
            </div>
                    
            {userFirstName && (
                <div style={userDropdownContainerStyles} ref={dropdownRef}>
                    <div
                        style={welcomeStyles}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {avatarUrl ? (
                            <div style={avatarContainerStyles}>
                                <Image
                                    width={"100"}
                                    height={"100"}
                                    src={avatarUrl}
                                    alt="Profile"
                                    style={avatarImageStyles}
                                />
                            </div>
                        ) : (
                            <div style={avatarPlaceholderStyles}>
                                <UserOutlined style={{ fontSize: '16px' }} />
                            </div>
                        )}
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
                    <div>
                    </div>
                </div>
                
            )}
        </div>
    );
}