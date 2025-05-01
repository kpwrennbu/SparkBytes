"use client";

import Link from "next/link"; //Link from Next.js
import { usePathname } from "next/navigation"; //get the Link currently selected with this hook
import { useNotifications } from "./NotificationProvider";
import { useState, useEffect, useRef } from "react"; //react hook
import supabase from '../api/supabaseClient'; //supabase import
import { styles, getLinkStyle } from "../utils/navigation.utils"
//AntdUI imports
import { Flex, Badge, Dropdown, List, Button } from "antd";
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
    BellOutlined
} from "@ant-design/icons";

export default function Navigation() {
    const pathname = usePathname(); //get current pathname
    const [userEmail, setUserEmail] = useState<string | null>(null); //path to hold users email
    const [userFirstName, setUserFirstName] = useState<string | null>(null); //path to hold users email;
    const [dropdownOpen, setDropdownOpen] = useState(false); //dropdown state
    const dropdownRef = useRef<HTMLDivElement>(null); // dropdown re state
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    // Sliding green background state
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    const [userId, setUserId] = useState<string | null>(null);

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
        } catch (error: any) {
            console.log('Error downloading image: ', error.message);
        }
    }

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

  // ← new: build the notification dropdown menu
  const notificationMenu = (
    <div style={{ width: 300 }}>
      <List
        size="small"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              background: item.read ? "#fff" : "#e6f7ff",
              cursor: "pointer",
            }}
            onClick={() => markAsRead(item.id)}
          >
            <List.Item.Meta
              title={item.payload.title}
              description={new Date(item.created_at).toLocaleString()}
            />
          </List.Item>
        )}
      />
      {unreadCount > 0 && (
        <div style={{ textAlign: "center", padding: 8 }}>
          <Button
            size="small"
            onClick={() =>
              notifications
                .filter((n) => !n.read)
                .forEach((n) => markAsRead(n.id))
            }
          >
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );


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

                    {!userFirstName && (
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
                                <img
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
            {/* {userFirstName && ( 
                  <Dropdown
                  // overlay={notificationMenu}
                  trigger={["click"]}
                  placement="bottomRight"
              >
                  <Badge count={unreadCount}>
                      <Button
                          type="text"
                          icon={<BellOutlined style={{ fontSize: 18 }} />}
                      />
                  </Badge>
  
              </Dropdown>
            )} */}
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
    display: "flex"
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

const avatarContainerStyles = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.1)",
};

const avatarImageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "cover"
};

const avatarPlaceholderStyles = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.1)",
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