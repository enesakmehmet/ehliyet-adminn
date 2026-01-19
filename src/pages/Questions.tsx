import React, { useEffect, useState } from 'react';
import api from '../services/apiClient';

interface Question {
    id: string;
    text: string;
    imageUrl: string | null;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    explanation: string;
    category: string;
    difficulty: string;
    licenseClasses: string[];
    totalAnswered: number;
    correctCount: number;
    wrongCount: number;
    isActive: boolean;
    createdAt: string;
}

const categoryLabels: Record<string, string> = {
    TRAFFIC_SIGNS: '🚸 Trafik İşaretleri',
    TRAFFIC_RULES: '📋 Trafik Kuralları',
    FIRST_AID: '🏥 İlk Yardım',
    MOTOR_KNOWLEDGE: '🔧 Motor Bilgisi',
    ENVIRONMENT: '🌍 Çevre Bilgisi',
    TRAFFIC_ETHICS: '🤝 Trafik Adabı',
    DANGEROUS_GOODS: '⚠️ Tehlikeli Madde',
    AVOIDANCE_TECHNIQUES: '🛡️ Kaçınma Teknikleri'
};

const difficultyLabels: Record<string, { label: string; color: string }> = {
    EASY: { label: 'Kolay', color: '#10B981' },
    MEDIUM: { label: 'Orta', color: '#F59E0B' },
    HARD: { label: 'Zor', color: '#EF4444' }
};

const QuestionsPage: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/questions');
            const data = response.data?.data?.questions || response.data?.questions || response.data || [];

            const questionList = Array.isArray(data) ? data : [];
            setQuestions(questionList);

            setStats({
                total: questionList.length,
                active: questionList.filter((q: Question) => q.isActive).length,
                inactive: questionList.filter((q: Question) => !q.isActive).length
            });
        } catch (error) {
            console.error('Sorular yüklenemedi:', error);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestionStatus = async (id: string, isActive: boolean) => {
        try {
            await api.put(`/admin/questions/${id}`, { isActive: !isActive });
            fetchQuestions();
        } catch (error) {
            console.error('Durum güncellenemedi:', error);
        }
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;

        try {
            await api.delete(`/admin/questions/${id}`);
            fetchQuestions();
        } catch (error) {
            console.error('Soru silinemedi:', error);
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesText = q.text.toLowerCase().includes(filter.toLowerCase());
        const matchesCategory = !categoryFilter || q.category === categoryFilter;
        return matchesText && matchesCategory;
    });

    const successRate = (q: Question) => {
        if (q.totalAnswered === 0) return 0;
        return Math.round((q.correctCount / q.totalAnswered) * 100);
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
                        ❓ Soru Yönetimi
                    </h1>
                    <p style={{ color: '#6B7280' }}>
                        Tüm sınav sorularını buradan yönetebilirsiniz
                    </p>
                </div>
                <button
                    onClick={() => { setSelectedQuestion(null); setShowModal(true); }}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
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
                    ➕ Yeni Soru Ekle
                </button>
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Toplam Soru</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.active}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Aktif Soru</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.inactive}</div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Pasif Soru</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="🔍 Soru ara..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '10px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white'
                    }}
                >
                    <option value="">Tüm Kategoriler</option>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Questions List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                    ⏳ Yükleniyor...
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: '#F9FAFB',
                    borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                    <div style={{ color: '#6B7280' }}>
                        {filter || categoryFilter ? 'Arama kriterlerine uygun soru bulunamadı' : 'Henüz soru eklenmemiş'}
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredQuestions.map((question) => (
                        <div
                            key={question.id}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                border: question.isActive ? '1px solid #E5E7EB' : '1px solid #FCA5A5',
                                opacity: question.isActive ? 1 : 0.7
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    {/* Category & Difficulty */}
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            background: '#EFF6FF',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            color: '#3B82F6'
                                        }}>
                                            {categoryLabels[question.category] || question.category}
                                        </span>
                                        <span style={{
                                            padding: '2px 8px',
                                            background: `${difficultyLabels[question.difficulty]?.color}20`,
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            color: difficultyLabels[question.difficulty]?.color || '#6B7280'
                                        }}>
                                            {difficultyLabels[question.difficulty]?.label || question.difficulty}
                                        </span>
                                        {!question.isActive && (
                                            <span style={{
                                                padding: '2px 8px',
                                                background: '#FEE2E2',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                color: '#EF4444'
                                            }}>
                                                🚫 Pasif
                                            </span>
                                        )}
                                    </div>

                                    {/* Question Text */}
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#1F2937',
                                        marginBottom: '8px',
                                        lineHeight: 1.5
                                    }}>
                                        {question.text.length > 200 ? question.text.slice(0, 200) + '...' : question.text}
                                    </p>

                                    {/* Options */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <span
                                                key={opt}
                                                style={{
                                                    fontSize: '12px',
                                                    color: question.correctAnswer === opt ? '#10B981' : '#6B7280',
                                                    fontWeight: question.correctAnswer === opt ? '600' : '400'
                                                }}
                                            >
                                                {question.correctAnswer === opt ? '✓' : ''} {opt}) {(question as any)[`option${opt}`]?.slice(0, 30)}
                                                {(question as any)[`option${opt}`]?.length > 30 ? '...' : ''}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
                                        <span>📊 {question.totalAnswered} cevap</span>
                                        <span>✅ %{successRate(question)} başarı</span>
                                        <span>📅 {new Date(question.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button
                                        onClick={() => { setSelectedQuestion(question); setShowModal(true); }}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#EFF6FF',
                                            color: '#3B82F6',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ✏️ Düzenle
                                    </button>
                                    <button
                                        onClick={() => toggleQuestionStatus(question.id, question.isActive)}
                                        style={{
                                            padding: '6px 12px',
                                            background: question.isActive ? '#FEF3C7' : '#ECFDF5',
                                            color: question.isActive ? '#D97706' : '#059669',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {question.isActive ? '⏸️ Pasif Yap' : '▶️ Aktif Yap'}
                                    </button>
                                    <button
                                        onClick={() => deleteQuestion(question.id)}
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
                    ))}
                </div>
            )}

            {/* Result Count */}
            {!loading && filteredQuestions.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>
                    {filteredQuestions.length} soru gösteriliyor
                </div>
            )}

            {/* Modal for Add/Edit - Basic placeholder */}
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
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '16px' }}>
                            {selectedQuestion ? '✏️ Soru Düzenle' : '➕ Yeni Soru Ekle'}
                        </h2>
                        <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                            Bu özellik yakında eklenecektir. Şimdilik soruları backend üzerinden yönetebilirsiniz.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                padding: '10px 20px',
                                background: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionsPage;
