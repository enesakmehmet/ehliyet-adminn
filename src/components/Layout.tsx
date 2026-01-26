import { type ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Overlay for mobile */}
            {isMobile && isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 20
                    }}
                />
            )}

            {/* Sidebar Container */}
            <div style={{
                position: isMobile ? 'fixed' : 'fixed', // Always fixed
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 30,
                transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
                transition: 'transform 0.3s ease',
                width: '256px'
            }}>
                <Sidebar />
            </div>

            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '256px', // Mobilde margin 0
                transition: 'margin-left 0.3s ease',
                width: isMobile ? '100%' : 'calc(100% - 256px)',
                position: 'relative'
            }}>
                {/* Header */}
                <header style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #E5E7EB',
                    height: '80px',
                    padding: isMobile ? '0 16px' : '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {isMobile && (
                            <button
                                onClick={toggleMenu}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    marginRight: '8px'
                                }}
                            >
                                ☰
                            </button>
                        )}

                        {/* Search Bar - Hide on small mobile */}
                        <div style={{
                            position: 'relative',
                            width: isMobile ? '100%' : '384px',
                            display: isMobile && window.innerWidth < 400 ? 'none' : 'block'
                        }}>
                            <span style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '16px',
                                opacity: 0.5
                            }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Ara..."
                                style={{
                                    width: '100%',
                                    paddingLeft: '40px',
                                    paddingRight: '16px',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    backgroundColor: '#F3F4F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '24px' }}>
                        <button style={{
                            position: 'relative',
                            padding: '8px',
                            color: '#6B7280',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '20px'
                        }}>
                            🔔
                            <span style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#EF4444',
                                borderRadius: '50%',
                                border: '2px solid white'
                            }}></span>
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            paddingLeft: isMobile ? '12px' : '24px',
                            borderLeft: '1px solid #E5E7EB'
                        }}>
                            {!isMobile && (
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Admin</p>
                                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Yönetici</p>
                                </div>
                            )}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#FFEDD5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#EA580C',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: isMobile ? '16px' : '32px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
