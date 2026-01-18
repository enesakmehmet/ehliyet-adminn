export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN' | 'PREMIUM';
    isPremium: boolean;
    premiumUntil?: string;
    totalQuestions: number;
    currentStreak: number;
    lastActive: string;
    createdAt: string;
}

export interface DashboardStats {
    totalUsers: number;
    premiumUsers: number;
    totalQuestions: number;
    totalTests: number;
    activeUsers: number;
    newUsers: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface PaginatedResponse<T> {
    users: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    }
}
