import React, { useEffect, useState } from 'react';
import api from '../services/apiClient';

interface AuditLog {
    id: string;
    userId: string | null;
    action: string;
    entity: string | null;
    entityId: string | null;
    changes: any;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [pagination.page]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/logs?page=${pagination.page}&limit=${pagination.limit}`);
            const data = response.data?.data || response.data;

            setLogs(data.logs || []);
            if (data.pagination) {
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Loglar yüklenemedi:', error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        if (action.includes('DELETE')) return '#EF4444';
        if (action.includes('CREATE')) return '#10B981';
        if (action.includes('UPDATE')) return '#F59E0B';
        if (action.includes('LOGIN')) return '#3B82F6';
        return '#6B7280';
    };

    const getActionIcon = (action: string) => {
        if (action.includes('DELETE')) return '🗑️';
        if (action.includes('CREATE')) return '➕';
        if (action.includes('UPDATE')) return '✏️';
        if (action.includes('LOGIN')) return '🔐';
        if (action.includes('LOGOUT')) return '🚪';
        return '📋';
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

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        (log.entity && log.entity.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
                    📋 Sistem Logları
                </h1>
                <p style={{ color: '#6B7280' }}>
                    Sistemdeki tüm işlemlerin kayıtları
                </p>
            </div>

            {/* Filter */}
            <div style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="🔍 Filtrele (action, entity)..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '10px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}
                />
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: '#EFF6FF',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>
                        {pagination.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Toplam Log</div>
                </div>
                <div style={{
                    background: '#ECFDF5',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                        {logs.filter(l => l.action.includes('CREATE')).length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Oluşturma</div>
                </div>
                <div style={{
                    background: '#FEF3C7',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>
                        {logs.filter(l => l.action.includes('UPDATE')).length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Güncelleme</div>
                </div>
                <div style={{
                    background: '#FEE2E2',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>
                        {logs.filter(l => l.action.includes('DELETE')).length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Silme</div>
                </div>
            </div>

            {/* Logs Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                    ⏳ Yükleniyor...
                </div>
            ) : filteredLogs.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: '#F9FAFB',
                    borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                    <div style={{ color: '#6B7280' }}>Henüz log kaydı bulunmuyor</div>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>TARİH</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>İŞLEM</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>VARLIK</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>IP ADRESİ</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>DETAY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log, index) => (
                                <tr
                                    key={log.id}
                                    style={{
                                        borderTop: index > 0 ? '1px solid #E5E7EB' : 'none',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                                        {formatDate(log.createdAt)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '4px 10px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            background: `${getActionColor(log.action)}15`,
                                            color: getActionColor(log.action)
                                        }}>
                                            {getActionIcon(log.action)} {log.action}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1F2937' }}>
                                        {log.entity || '-'}
                                        {log.entityId && (
                                            <span style={{ color: '#9CA3AF', fontSize: '12px', marginLeft: '4px' }}>
                                                #{log.entityId.slice(0, 8)}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280', fontFamily: 'monospace' }}>
                                        {log.ipAddress || '-'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {log.changes ? (
                                            <button
                                                onClick={() => alert(JSON.stringify(log.changes, null, 2))}
                                                style={{
                                                    padding: '4px 8px',
                                                    background: '#E5E7EB',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                👁️ Görüntüle
                                            </button>
                                        ) : (
                                            <span style={{ color: '#9CA3AF' }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '24px'
                }}>
                    <button
                        onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        disabled={pagination.page <= 1}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            background: pagination.page <= 1 ? '#F3F4F6' : 'white',
                            cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        ← Önceki
                    </button>
                    <span style={{ color: '#6B7280' }}>
                        Sayfa {pagination.page} / {pagination.pages}
                    </span>
                    <button
                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                        disabled={pagination.page >= pagination.pages}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            background: pagination.page >= pagination.pages ? '#F3F4F6' : 'white',
                            cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Sonraki →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LogsPage;
