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

    const initialFormState = {
        text: '',
        imageUrl: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        category: 'TRAFFIC_SIGNS',
        difficulty: 'MEDIUM',
        isActive: true
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (selectedQuestion) {
            setFormData({
                text: selectedQuestion.text,
                imageUrl: selectedQuestion.imageUrl || '',
                optionA: selectedQuestion.optionA,
                optionB: selectedQuestion.optionB,
                optionC: selectedQuestion.optionC,
                optionD: selectedQuestion.optionD,
                correctAnswer: selectedQuestion.correctAnswer,
                explanation: selectedQuestion.explanation || '',
                category: selectedQuestion.category,
                difficulty: selectedQuestion.difficulty,
                isActive: selectedQuestion.isActive
            });
        } else {
            setFormData(initialFormState);
        }
    }, [selectedQuestion, showModal]);

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
            alert('Soru silinirken hata oluştu');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedQuestion) {
                // Update implementation (TODO: Add backend endpoint)
                alert('Düzenleme özelliği henüz aktif değil (Backend desteği gerekiyor)');
            } else {
                // Create
                await api.post('/questions', formData);
                alert('Soru başarıyla oluşturuldu');
            }
            setShowModal(false);
            fetchQuestions();
        } catch (error: any) {
            console.error('İşlem başarısız:', error);
            alert('Hata oluştu: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
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

            {/* Modal for Add/Edit */}
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
                        maxWidth: '800px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                            {selectedQuestion ? '✏️ Soru Düzenle' : '➕ Yeni Soru Ekle'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        required
                                    >
                                        {Object.entries(categoryLabels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Zorluk</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                    >
                                        {Object.entries(difficultyLabels).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Soru Metni</label>
                                <textarea
                                    value={formData.text}
                                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', minHeight: '80px' }}
                                    required
                                    placeholder="Soru metnini buraya giriniz..."
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Görsel (Opsiyonel)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                />
                                {formData.imageUrl && (
                                    <div style={{ marginTop: '10px', position: 'relative', width: 'fit-content' }}>
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            style={{
                                                position: 'absolute', top: -10, right: -10,
                                                background: 'red', color: 'white', border: 'none', borderRadius: '50%',
                                                width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >✕</button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {['A', 'B', 'C', 'D'].map((opt) => (
                                    <div key={opt}>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Seçenek {opt}</label>
                                        <input
                                            type="text"
                                            value={(formData as any)[`option${opt}`]}
                                            onChange={e => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '8px',
                                                border: `1px solid ${formData.correctAnswer === opt ? '#10B981' : '#E5E7EB'}`,
                                                background: formData.correctAnswer === opt ? '#F0FDF4' : 'white'
                                            }}
                                            required
                                            placeholder={`${opt} şıkkı...`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Doğru Cevap</label>
                                <select
                                    value={formData.correctAnswer}
                                    onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', fontWeight: 'bold', color: '#059669' }}
                                    required
                                >
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <option key={opt} value={opt}>Seçenek {opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Açıklama / İpucu (Opsiyonel)</label>
                                <textarea
                                    value={formData.explanation}
                                    onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', minHeight: '60px' }}
                                    placeholder="Cevap açıklaması..."
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#E5E7EB',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        fontWeight: '500',
                                        minWidth: '100px'
                                    }}
                                >
                                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionsPage;
