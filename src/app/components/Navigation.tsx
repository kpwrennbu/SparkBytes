"use client";

import Link from "next/link"; //Link from Next.js
import { usePathname } from "next/navigation"; //get the Link currently selected with this hook
import { useState, useEffect, useRef } from "react"; //react hook
import supabase from '../api/supabaseClient'; //supabase import
import { styles, getLinkStyle } from "../utils/navigation.utils"
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
    PushpinOutlined
} from "@ant-design/icons";

export default function Navigation() {
    const pathname = usePathname(); //get current pathname
    const [userEmail, setUserEmail] = useState<string | null>(null); //path to hold users email
    const [dropdownOpen, setDropdownOpen] = useState(false); //dropdown state
    const dropdownRef = useRef<HTMLDivElement>(null); // dropdown re state

    // Sliding green background state
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    //get user useEffect [Wellington can explain this better]
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserEmail(user?.email ?? null);
        };
        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUserEmail(session?.user?.email ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    //dropdown state manager [Wellington can explain this more]
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
        <div style={styles.header}>
          <div style={{ position: "relative", height: "36px", flex: 1 }}>
            <div style={styles.navLinks}>
              <div
                ref={indicatorRef}
                style={{ ...styles.indicatorBase, ...indicatorStyle } as React.CSSProperties}
                ></div>
      
              <Link href="/" ref={(el) => { tabRefs.current[0] = el; }} style={getLinkStyle(pathname, "/")}>
                <Flex justify="center" align="center" gap="8px" style={styles.linkText as React.CSSProperties}>
                  <HomeOutlined style={{ alignSelf: "start", bottom: "2px" }} />
                  Home
                </Flex>
              </Link>
      
              <Link href="/events" ref={(el) => { tabRefs.current[1] = el; }} style={getLinkStyle(pathname, "/events")}>
                <Flex justify="center" align="center" gap="8px" style={styles.linkText as React.CSSProperties}>
                  <PushpinOutlined style={{ alignSelf: "start", bottom: "2px" }} />
                  Events
                </Flex>
              </Link>
      
              <Link href="/about" ref={(el) => { tabRefs.current[2] = el; }} style={getLinkStyle(pathname, "/about")}>
                <Flex justify="center" align="center" gap="8px" style={styles.linkText as React.CSSProperties}>
                  <InfoCircleOutlined /> About
                </Flex>
              </Link>
      
              <Link href="/orders" ref={(el) => { tabRefs.current[3] = el; }} style={getLinkStyle(pathname, "/orders")}>
                <Flex justify="center" align="center" gap="8px" style={styles.linkText as React.CSSProperties}>
                  <ShoppingCartOutlined /> Orders
                </Flex>
              </Link>
      
              {!userEmail && (
                <>
                  <Link href="/login" ref={(el) => { tabRefs.current[4] = el; }} style={getLinkStyle(pathname, "/login")}>
                    <Flex justify="center" align="center" gap="8px" style={styles.linkText as React.CSSProperties}>
                      <LoginOutlined /> Login
                    </Flex>
                  </Link>
      
                  <Link href="/signup" ref={(el) => { tabRefs.current[5] = el; }} style={getLinkStyle(pathname, "/signup")}>
                    <Flex justify="center" align="center" gap="8px" style={styles.linkText as React.CSSProperties}>
                      <UserAddOutlined /> Sign Up
                    </Flex>
                  </Link>
                </>
              )}
            </div>
          </div>
      
          {userEmail && (
            <div style={styles.userDropdownContainer} ref={dropdownRef}>
              <div style={styles.welcome} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <UserOutlined />
                <DownOutlined style={{ fontSize: "8px" }} />
              </div>
              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <Link href="/editaccount" style={styles.dropdownItem}>
                    <EditOutlined /> Edit Account
                  </Link>
                  <div style={styles.dropdownItem} onClick={handleLogout}>
                    <LogoutOutlined /> Log Out
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
      
}

