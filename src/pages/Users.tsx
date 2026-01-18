import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://zesty-consideration-production.up.railway.app/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isPremium: boolean;
    totalQuestions: number;
    currentStreak: number;
    lastActive: string;
    createdAt: string;
}

// Mock users for demo mode
const mockUsers: User[] = [
    { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'USER', isPremium: false, totalQuestions: 245, currentStreak: 5, lastActive: new Date().toISOString(), createdAt: '2025-12-15' },
    { id: '2', name: 'Fatma Kaya', email: 'fatma@example.com', role: 'PREMIUM', isPremium: true, totalQuestions: 512, currentStreak: 12, lastActive: new Date().toISOString(), createdAt: '2025-11-20' },
    { id: '3', name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'USER', isPremium: false, totalQuestions: 89, currentStreak: 2, lastActive: new Date().toISOString(), createdAt: '2026-01-05' },
    { id: '4', name: 'Ayşe Öztürk', email: 'ayse@example.com', role: 'ADMIN', isPremium: true, totalQuestions: 1024, currentStreak: 30, lastActive: new Date().toISOString(), createdAt: '2025-10-01' },
    { id: '5', name: 'Ali Çelik', email: 'ali@example.com', role: 'USER', isPremium: false, totalQuestions: 156, currentStreak: 0, lastActive: new Date().toISOString(), createdAt: '2026-01-08' },
];

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/users`);
                setUsers(response.data.users || response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Backend bağlantısı kurulamadı. Demo veriler gösteriliyor.');
                setUsers(mockUsers);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Kullanıcılar</h1>
                    <p style={{ color: '#6B7280', marginTop: '4px' }}>Tüm kayıtlı kullanıcıları yönetin ({users.length} kullanıcı)</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>🔍</span>
                        <input
                            type="text"
                            placeholder="İsim veya E-posta ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                paddingLeft: '40px',
                                paddingRight: '16px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                outline: 'none',
                                width: '280px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Error Notice */}
            {error && (
                <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '14px'
                }}>
                    <span>⚠️</span>
                    <span style={{ color: '#92400E' }}>{error}</span>
                </div>
            )}

            <div style={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Kullanıcı</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Rol</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>İstatistikler</th>
                                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ height: '40px', width: '200px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ height: '24px', width: '80px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ height: '20px', width: '100px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ height: '20px', width: '120px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '48px 24px', textAlign: 'center', color: '#6B7280' }}>
                                        Kullanıcı bulunamadı
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#FFF7ED',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#EA580C',
                                                    fontWeight: 'bold',
                                                    border: '1px solid #FFEDD5'
                                                }}>
                                                    {user.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, color: '#1F2937', margin: 0 }}>{user.name || 'İsimsiz'}</p>
                                                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>📧 {user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                backgroundColor: user.role === 'ADMIN' ? '#F3E8FF' : user.isPremium ? '#FEF3C7' : '#F3F4F6',
                                                color: user.role === 'ADMIN' ? '#7C3AED' : user.isPremium ? '#B45309' : '#4B5563',
                                                border: `1px solid ${user.role === 'ADMIN' ? '#DDD6FE' : user.isPremium ? '#FDE68A' : '#E5E7EB'}`
                                            }}>
                                                {user.role === 'ADMIN' ? '👑 Admin' : user.isPremium ? '⭐ Premium' : '👤 Kullanıcı'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <p style={{ fontWeight: 500, color: '#1F2937', margin: 0 }}>{user.totalQuestions || 0} Soru</p>
                                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>🔥 {user.currentStreak || 0} gün seri</p>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontSize: '14px', color: '#4B5563' }}>📅 {formatDate(user.createdAt)}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
