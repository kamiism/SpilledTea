import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import appwriteService from '../../appwrite/config';
import { logout, login as authLogin } from '../../store/authSlice';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setIsEditing(false);
    };

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
            setIsOpen(false);
            navigate('/');
        });
    };

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === userData.name) {
            setIsEditing(false);
            return;
        }
        setIsUpdating(true);
        try {
            await authService.updateName(newName);
            
            // Sync new name across all posts by this user
            if (userData.$id) {
                await appwriteService.updateAuthorNameInPosts(userData.$id, newName);
            }
            
            const updatedUser = await authService.getCurrentUser();
            if (updatedUser) dispatch(authLogin(JSON.parse(JSON.stringify(updatedUser))));
            
            // Force reload to refresh post cards on screen
            window.location.reload();
            setIsEditing(false);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsEditing(false);
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
                className="hexagon-avatar font-bold text-lg font-heading text-[var(--color-eva-orange)] outline-none relative"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {initial}
                {isOpen && <span className="absolute -bottom-2 w-full h-[2px] bg-[var(--color-eva-orange)] shadow-[0_0_8px_rgba(255,102,0,0.5)]"></span>}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40 md:hidden bg-black/80" 
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    ></div>

                    <div 
                        className="fixed bottom-0 left-0 w-full z-50 md:absolute md:top-[120%] md:bottom-auto md:left-auto md:-right-4 md:w-64 bg-[var(--color-eva-panel)] border border-[var(--color-eva-orange)] animate-fade-in"
                        style={{ boxShadow: '0 4px 20px rgba(255,102,0,0.15)' }}
                    >
                        <div className="corner-brackets absolute inset-0 pointer-events-none"></div>
                        <div className="p-5 flex flex-col gap-4 relative z-10">
                            <div className="text-[var(--color-eva-green)] font-mono text-[10px] uppercase tracking-widest border-b border-[var(--color-eva-border)] pb-2 mb-2 flex justify-between items-center">
                                <span>&gt; PILOT_PROFILE</span>
                                {!isEditing && (
                                    <button 
                                        onClick={() => {
                                            setNewName(userData.name);
                                            setIsEditing(true);
                                        }}
                                        className="text-[var(--color-eva-orange)] hover:text-[var(--color-eva-white)] transition-colors"
                                    >
                                        [EDIT]
                                    </button>
                                )}
                            </div>
                            
                            {/* User Info */}
                            <div className="flex flex-col mb-4">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <input 
                                            type="text" 
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full bg-[rgba(0,255,65,0.05)] border border-[var(--color-eva-orange)] text-[var(--color-eva-white)] font-heading text-lg p-2 outline-none uppercase tracking-wider"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleUpdateName}
                                                disabled={isUpdating}
                                                className="flex-1 bg-[var(--color-eva-orange)] text-black font-mono text-xs py-1 hover:bg-[var(--color-eva-white)] transition-colors"
                                            >
                                                {isUpdating ? '...' : 'SAVE'}
                                            </button>
                                            <button 
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 border border-[var(--color-eva-border)] text-[var(--color-eva-muted)] font-mono text-xs py-1 hover:text-[var(--color-eva-white)] hover:border-[var(--color-eva-white)] transition-colors"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="font-heading text-xl uppercase text-[var(--color-eva-white)] truncate tracking-wider">
                                        {userData.name}
                                    </span>
                                )}
                                <span className="font-mono text-xs text-[var(--color-eva-muted)] truncate mt-1">
                                    ID: {userData.email}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={logoutHandler}
                                className="w-full py-3 font-heading tracking-widest uppercase text-center border border-[var(--color-eva-red)] text-[var(--color-eva-red)] hover:bg-[var(--color-eva-red)] hover:text-white transition-colors"
                            >
                                TERMINATE SYNC
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
