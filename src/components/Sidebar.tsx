import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: '📊', label: 'Dashboard', path: '/' },
        { icon: '👥', label: 'Kullanıcılar', path: '/users' },
        { icon: '❓', label: 'Sorular', path: '/questions' },
        { icon: '📋', label: 'Loglar', path: '/logs' },
    ];

    const linkStyle = (isActive: boolean) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? '#FFF7ED' : 'transparent',
        color: isActive ? '#EA580C' : '#4B5563',
    });

    return (
        <div style={{
            width: '256px',
            backgroundColor: 'white',
            borderRight: '1px solid #E5E7EB',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            {/* Logo */}
            <div style={{
                padding: '24px',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '20px' }}>🚗</span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1F2937' }}>Ehliyet Admin</span>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '16px' }}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px',
                    paddingLeft: '12px'
                }}>
                    ANAMENÜ
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={() => linkStyle(location.pathname === item.path)}
                    >
                        <span style={{ fontSize: '18px' }}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}

                <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '32px',
                    marginBottom: '16px',
                    paddingLeft: '12px'
                }}>
                    GENEL
                </div>

                <NavLink
                    to="/settings"
                    style={() => linkStyle(location.pathname === '/settings')}
                >
                    <span style={{ fontSize: '18px' }}>⚙️</span>
                    Ayarlar
                </NavLink>
            </nav>

            {/* Footer */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid #F3F4F6'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#FEF2F2',
                    borderRadius: '8px',
                    color: '#DC2626',
                    fontSize: '14px',
                    fontWeight: 500
                }}>
                    <span style={{ fontSize: '18px' }}>🚪</span>
                    Demo Modu (Login Yok)
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
