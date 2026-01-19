import React, { useEffect, useState } from 'react';
import api from '../services/apiClient';

interface Notification {
    id: string;
    userId: string | null;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    isSent: boolean;
    sentAt: string | null;
    scheduledFor: string | null;
    createdAt: string;
}

interface Stats {
    total: number;
    sent: number;
    pending: number;
    scheduled: number;
}

const notificationTypes: Record<string, { label: string; icon: string; color: string }> = {
    DAILY_REMINDER: { label: 'Günlük Hatırlatma', icon: '⏰', color: '#3B82F6' },
    STREAK_ACHIEVEMENT: { label: 'Seri Başarısı', icon: '🔥', color: '#F59E0B' },
    BADGE_EARNED: { label: 'Rozet Kazanıldı', icon: '🏆', color: '#10B981' },
    EXAM_REMINDER: { label: 'Sınav Hatırlatması', icon: '📚', color: '#8B5CF6' },
    PREMIUM_EXPIRING: { label: 'Premium Süresi', icon: '⭐', color: '#EC4899' }
};

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({ total: 0, sent: 0, pending: 0, scheduled: 0 });
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'DAILY_REMINDER',
        sendToAll: true,
        userId: ''
    });

    useEffect(() => {
        fetchNotifications();
        fetchStats();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/notifications');
            const data = response.data?.data?.notifications || response.data?.notifications || [];
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Bildirimler yüklenemedi:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/notifications/stats');
            setStats(response.data?.data || { total: 0, sent: 0, pending: 0, scheduled: 0 });
        } catch (error) {
            console.error('İstatistikler yüklenemedi:', error);
        }
    };

    const handleCreateNotification = async () => {
        try {
            await api.post('/admin/notifications', {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                userId: formData.sendToAll ? null : formData.userId
            });
            setShowModal(false);
            setFormData({ title: '', message: '', type: 'DAILY_REMINDER', sendToAll: true, userId: '' });
            fetchNotifications();
            fetchStats();
        } catch (error) {
            console.error('Bildirim oluşturulamadı:', error);
            alert('Bildirim oluşturulurken hata oluştu');
        }
    };

    const handleSendNotification = async (id: string) => {
        try {
            await api.post(`/admin/notifications/${id}/send`);
            fetchNotifications();
            fetchStats();
            alert('Bildirim gönderildi!');
        } catch (error) {
            console.error('Bildirim gönderilemedi:', error);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        if (!confirm('Bu bildirimi silmek istediğinize emin misiniz?')) return;

        try {
            await api.delete(`/admin/notifications/${id}`);
            fetchNotifications();
            fetchStats();
        } catch (error) {
            console.error('Bildirim silinemedi:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
                        🔔 Bildirim Yönetimi
                    </h1>
                    <p style={{ color: '#6B7280' }}>
                        Kullanıcılara push bildirim gönder
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ➕ Yeni Bildirim
                </button>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Bildirim</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.sent}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Gönderildi</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.pending}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Bekliyor</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.scheduled}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Zamanlanmış</div>
                </div>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                    ⏳ Yükleniyor...
                </div>
            ) : notifications.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: '#F9FAFB',
                    borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔕</div>
                    <div style={{ color: '#6B7280' }}>Henüz bildirim oluşturulmamış</div>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            marginTop: '16px',
                            padding: '10px 20px',
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        İlk Bildirimi Oluştur
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifications.map((notification) => {
                        const typeInfo = notificationTypes[notification.type] || { label: notification.type, icon: '📢', color: '#6B7280' };

                        return (
                            <div
                                key={notification.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: '1px solid #E5E7EB',
                                    opacity: notification.isSent ? 0.7 : 1
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        {/* Type & Status */}
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                background: `${typeInfo.color}20`,
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                color: typeInfo.color
                                            }}>
                                                {typeInfo.icon} {typeInfo.label}
                                            </span>
                                            {notification.isSent ? (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: '#ECFDF5',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    color: '#059669'
                                                }}>
                                                    ✅ Gönderildi
                                                </span>
                                            ) : (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: '#FEF3C7',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    color: '#D97706'
                                                }}>
                                                    ⏳ Bekliyor
                                                </span>
                                            )}
                                            {notification.userId ? (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: '#EFF6FF',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    color: '#3B82F6'
                                                }}>
                                                    👤 Tek Kullanıcı
                                                </span>
                                            ) : (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: '#F3E8FF',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    color: '#7C3AED'
                                                }}>
                                                    👥 Tüm Kullanıcılar
                                                </span>
                                            )}
                                        </div>

                                        {/* Title & Message */}
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                                            {notification.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                                            {notification.message}
                                        </p>

                                        {/* Date */}
                                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                            📅 Oluşturulma: {formatDate(notification.createdAt)}
                                            {notification.sentAt && ` • 📤 Gönderilme: ${formatDate(notification.sentAt)}`}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {!notification.isSent && (
                                            <button
                                                onClick={() => handleSendNotification(notification.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#10B981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                📤 Gönder
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#FEE2E2',
                                                color: '#DC2626',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🗑️ Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                            🔔 Yeni Bildirim Oluştur
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                                Bildirim Türü
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                {Object.entries(notificationTypes).map(([key, { label, icon }]) => (
                                    <option key={key} value={key}>{icon} {label}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                                Başlık
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Bildirim başlığı..."
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                                Mesaj
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Bildirim mesajı..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.sendToAll}
                                    onChange={(e) => setFormData({ ...formData, sendToAll: e.target.checked })}
                                />
                                <span style={{ fontWeight: '500', color: '#374151' }}>Tüm kullanıcılara gönder</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#F3F4F6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleCreateNotification}
                                disabled={!formData.title || !formData.message}
                                style={{
                                    padding: '10px 20px',
                                    background: formData.title && formData.message ? '#3B82F6' : '#9CA3AF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: formData.title && formData.message ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
