import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
            setIsOpen(false);
            navigate('/');
        });
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (!userData) return null;

    const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : '?';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-material elevation-1"
                style={{
                    fontFamily: 'var(--font-heading)',
                    background: 'var(--color-obsidian-light)',
                    color: 'var(--color-taupe)',
                    border: '2px solid var(--color-umber)',
                }}
                onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--color-burgundy)';
                    e.target.style.color = 'var(--color-ivory)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--color-umber)';
                    e.target.style.color = 'var(--color-taupe)';
                }}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {initial}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Mobile Overlay (to close on click outside the panel on mobile, optional but good UX) */}
                    <div 
                        className="fixed inset-0 z-40 md:hidden bg-black/50" 
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    ></div>

                    <div 
                        className="fixed bottom-0 left-0 w-full z-50 md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:w-64 md:mt-2 glass-surface-heavy animate-slide-up elevation-3 md:rounded-xl rounded-t-2xl rounded-b-none"
                    >
                        <div className="p-5 flex flex-col gap-4">
                            {/* User Info */}
                            <div className="flex flex-col">
                                <span 
                                    className="font-bold text-lg truncate" 
                                    style={{ color: 'var(--color-ivory)' }}
                                >
                                    {userData.name}
                                </span>
                                <span 
                                    className="text-sm truncate" 
                                    style={{ color: 'var(--color-taupe-muted)' }}
                                >
                                    {userData.email}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full" style={{ background: 'var(--color-umber)' }}></div>

                            {/* Logout Button */}
                            <button
                                onClick={logoutHandler}
                                className="w-full py-3 text-sm font-semibold tracking-wider uppercase rounded-lg tea-ripple transition-material text-center"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    color: 'var(--color-ivory)',
                                    background: 'transparent',
                                    border: '2px solid var(--color-burgundy)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'var(--color-burgundy-glow)';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
