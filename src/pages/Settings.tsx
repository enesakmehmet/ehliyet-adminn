import { useEffect, useState } from 'react';
import api from '../services/apiClient';

interface ExamLimits {
    freeExamsPerDay: number;
    extraExamsPerAd: number;
    maxExamsPerDay: number;
    resetHour: number;
}

interface AppSettings {
    totalActiveQuestions: number;
    classicExamQuestionCount: number;
    quickTestQuestionCount: number;
    dailyQuestionGoal: number;
    examLimits: ExamLimits;
}

const Settings = () => {
    const [settings, setSettings] = useState<AppSettings>({
        totalActiveQuestions: 500,
        classicExamQuestionCount: 50,
        quickTestQuestionCount: 10,
        dailyQuestionGoal: 20,
        examLimits: {
            freeExamsPerDay: 1,
            extraExamsPerAd: 1,
            maxExamsPerDay: 10,
            resetHour: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            if (response.data.success && response.data.data) {
                setSettings(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            // Use default values
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const response = await api.put('/admin/settings', settings);
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Ayarlar kaydedilemedi.' });
            }
        } catch (err) {
            console.error('Failed to save settings:', err);
            setMessage({ type: 'error', text: 'Sunucu hatası oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: keyof AppSettings, value: number) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleExamLimitChange = (key: keyof ExamLimits, value: number) => {
        setSettings(prev => ({
            ...prev,
            examLimits: { ...prev.examLimits, [key]: value }
        }));
    };

    const SettingCard = ({
        title,
        description,
        value,
        onChange,
        icon,
        min = 1,
        max = 1000
    }: {
        title: string;
        description: string;
        value: number;
        onChange: (val: number) => void;
        icon: string;
        min?: number;
        max?: number;
    }) => (
        <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #F3F4F6',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '16px'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    fontSize: '24px'
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
                        {title}
                    </h3>
                    <p style={{ margin: '4px 0 12px', fontSize: '14px', color: '#6B7280' }}>
                        {description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
                            min={min}
                            max={max}
                            style={{
                                width: '120px',
                                padding: '10px 14px',
                                fontSize: '16px',
                                fontWeight: 600,
                                border: '2px solid #E5E7EB',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                            (min: {min}, max: {max})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                    ⚙️ Uygulama Ayarları
                </h1>
                <p style={{ color: '#6B7280', marginTop: '8px' }}>
                    Uygulama genelinde geçerli olan ayarları buradan düzenleyebilirsiniz.
                </p>
            </div>

            {message && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                    color: message.type === 'success' ? '#065F46' : '#991B1B',
                    fontWeight: 500
                }}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    Yükleniyor...
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>
                            📊 Soru Sayıları
                        </h2>

                        <SettingCard
                            icon="📚"
                            title="Toplam Aktif Soru Sayısı"
                            description="Uygulamada gösterilecek toplam soru sayısı (Ana ekranda görünür)"
                            value={settings.totalActiveQuestions}
                            onChange={(val) => handleChange('totalActiveQuestions', val)}
                            min={100}
                            max={10000}
                        />

                        <SettingCard
                            icon="📝"
                            title="Klasik Sınav Soru Sayısı"
                            description="Klasik sınav modunda sorulacak soru adedi"
                            value={settings.classicExamQuestionCount}
                            onChange={(val) => handleChange('classicExamQuestionCount', val)}
                            min={10}
                            max={100}
                        />

                        <SettingCard
                            icon="⚡"
                            title="Hızlı Test Soru Sayısı"
                            description="Hızlı test modunda sorulacak soru adedi"
                            value={settings.quickTestQuestionCount}
                            onChange={(val) => handleChange('quickTestQuestionCount', val)}
                            min={5}
                            max={50}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>
                            🎯 Hedefler
                        </h2>

                        <SettingCard
                            icon="🔥"
                            title="Günlük Soru Hedefi (Varsayılan)"
                            description="Yeni kullanıcılar için varsayılan günlük soru hedefi"
                            value={settings.dailyQuestionGoal}
                            onChange={(val) => handleChange('dailyQuestionGoal', val)}
                            min={5}
                            max={100}
                        />
                    </div>

                    {/* Exam Limits Section - Force Update */}
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>
                            🎟️ Sınav Hakkı Limitleri
                        </h2>
                        <p style={{ color: '#6B7280', marginBottom: '16px', fontSize: '14px' }}>
                            Kullanıcıların günlük sınav haklarını ve reklam ile kazanabilecekleri hakları ayarlayın.
                        </p>

                        <SettingCard
                            icon="🆓"
                            title="Günlük Ücretsiz Sınav Hakkı"
                            description="Her kullanıcının günde ücretsiz girebileceği sınav sayısı"
                            value={settings.examLimits?.freeExamsPerDay || 1}
                            onChange={(val) => handleExamLimitChange('freeExamsPerDay', val)}
                            min={0}
                            max={10}
                        />

                        <SettingCard
                            icon="📺"
                            title="Reklam Başına Ek Sınav Hakkı"
                            description="Bir reklam izleyince kazanılacak ek sınav hakkı sayısı"
                            value={settings.examLimits?.extraExamsPerAd || 1}
                            onChange={(val) => handleExamLimitChange('extraExamsPerAd', val)}
                            min={1}
                            max={5}
                        />

                        <SettingCard
                            icon="🔒"
                            title="Günlük Maksimum Sınav Sayısı"
                            description="Bir kullanıcının (reklamlar dahil) günde girebileceği maksimum sınav sayısı"
                            value={settings.examLimits?.maxExamsPerDay || 10}
                            onChange={(val) => handleExamLimitChange('maxExamsPerDay', val)}
                            min={1}
                            max={50}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        paddingTop: '16px',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                padding: '12px 32px',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'white',
                                backgroundColor: saving ? '#9CA3AF' : '#4A90E2',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => !saving && (e.currentTarget.style.backgroundColor = '#3B7DD8')}
                            onMouseOut={(e) => !saving && (e.currentTarget.style.backgroundColor = '#4A90E2')}
                        >
                            {saving ? '⏳ Kaydediliyor...' : '💾 Ayarları Kaydet'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Settings;
