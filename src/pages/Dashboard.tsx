import { useEffect, useState } from 'react';
import api from '../services/apiClient';

// API URL is configured in apiClient.ts

interface Stats {
    totalUsers: number;
    premiumUsers: number;
    totalQuestions: number;
    totalTests: number;
    activeUsers: number;
    newUsers: number;
}

const Dashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard');
                // Backend returns {success: true, data: {stats: {...}}}
                const statsData = response.data.data?.stats || response.data.stats || response.data;
                setStats(statsData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
                setError('Backend bağlantısı kurulamadı. Demo veriler gösteriliyor.');
                // Fallback to demo data
                setStats({
                    totalUsers: 1247,
                    premiumUsers: 89,
                    totalQuestions: 572,
                    totalTests: 3421,
                    activeUsers: 156,
                    newUsers: 42
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }: { title: string; value: number | undefined; icon: string; color: string }) => (
        <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #F3F4F6',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.2s ease'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500, margin: 0 }}>{title}</p>
                    <h3 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginTop: '8px',
                        marginBottom: 0
                    }}>
                        {loading ? '...' : value?.toLocaleString()}
                    </h3>
                </div>
                <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: color,
                    fontSize: '24px'
                }}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Dashboard <span style={{ fontSize: '12px', color: '#ccc' }}>v3</span></h1>
                <p style={{ color: '#6B7280', marginTop: '4px' }}>Uygulama istatistiklerine genel bakış</p>
            </div>

            {/* Error/Demo Notice */}
            {error && (
                <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <div>
                        <p style={{ fontWeight: 600, color: '#92400E', margin: 0 }}>Demo Modu</p>
                        <p style={{ fontSize: '14px', color: '#B45309', margin: 0 }}>{error}</p>
                    </div>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                <StatCard
                    title="Toplam Kullanıcı"
                    value={stats?.totalUsers}
                    icon="👥"
                    color="#DBEAFE"
                />
                <StatCard
                    title="Premium Üyeler"
                    value={stats?.premiumUsers}
                    icon="👑"
                    color="#F3E8FF"
                />
                <StatCard
                    title="Aktif Sorular"
                    value={stats?.totalQuestions}
                    icon="❓"
                    color="#FFEDD5"
                />
                <StatCard
                    title="Tamamlanan Testler"
                    value={stats?.totalTests}
                    icon="✅"
                    color="#D1FAE5"
                />
                <StatCard
                    title="Aktif Kullanıcılar (7 Gün)"
                    value={stats?.activeUsers}
                    icon="📈"
                    color="#E0E7FF"
                />
                <StatCard
                    title="Yeni Kayıtlar (30 Gün)"
                    value={stats?.newUsers}
                    icon="➕"
                    color="#FCE7F3"
                />
            </div>

            {/* Recent Activity */}
            <div style={{
                marginTop: '32px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #F3F4F6',
                padding: '24px'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginTop: 0 }}>
                    Son Aktiviteler
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    {[
                        { icon: '👤', text: 'Yeni kullanıcı kaydoldu: Ahmet Y.', time: '2 dakika önce' },
                        { icon: '✅', text: 'Test tamamlandı: 45/50 doğru', time: '5 dakika önce' },
                        { icon: '👑', text: 'Premium üyelik satın alındı', time: '12 dakika önce' },
                        { icon: '📱', text: 'iOS uygulaması güncellendi', time: '1 saat önce' },
                    ].map((activity, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#F9FAFB',
                            borderRadius: '8px'
                        }}>
                            <span style={{ fontSize: '20px' }}>{activity.icon}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '14px', color: '#1F2937' }}>{activity.text}</p>
                            </div>
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
