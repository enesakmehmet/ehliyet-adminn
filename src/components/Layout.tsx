import { type ReactNode } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <Sidebar />

            <main style={{
                flex: 1,
                marginLeft: '256px'
            }}>
                {/* Header */}
                <header style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #E5E7EB',
                    height: '80px',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '384px' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
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
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
                            paddingLeft: '24px',
                            borderLeft: '1px solid #E5E7EB'
                        }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Admin</p>
                                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Yönetici</p>
                            </div>
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

                <div style={{ padding: '32px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
