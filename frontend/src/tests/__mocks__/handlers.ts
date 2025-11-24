// Mock API response handlers
export const mockHandlers = {
  auth: {
    login: jest.fn((username, password) => {
      if (username === 'admin' && password === 'admin123') {
        return Promise.resolve({
          success: true,
          data: {
            user: {
              id: '1',
              username: 'admin',
              name: '管理员',
              email: 'admin@example.com',
              role: 'admin',
              department: '系统管理',
              createdAt: '2024-01-01T00:00:00.000Z',
            },
            token: 'mock-jwt-token',
          },
        });
      }
      if (username === 'teacher' && password === 'teacher123') {
        return Promise.resolve({
          success: true,
          data: {
            user: {
              id: '2',
              username: 'teacher',
              name: '教师',
              email: 'teacher@example.com',
              role: 'teacher',
              department: '计算机系',
              createdAt: '2024-01-01T00:00:00.000Z',
            },
            token: 'mock-jwt-token-teacher',
          },
        });
      }
      return Promise.resolve({
        success: false,
        message: '用户名或密码错误',
      });
    }),

    logout: jest.fn(() => Promise.resolve({ success: true })),
    getCurrentUser: jest.fn(() => Promise.resolve({
      success: true,
      data: {
        id: '1',
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
        department: '系统管理',
      },
    })),
    updateProfile: jest.fn(() => Promise.resolve({ success: true })),
  },

  dashboard: {
    stats: jest.fn(() => Promise.resolve({
      totalTeachers: 150,
      totalCourses: 280,
      totalClasses: 120,
      totalEvaluations: 3500,
      pendingEvaluations: 25,
      completedEvaluations: 3475,
      averageScore: 4.2,
      monthlyTrends: [
        { month: '1月', evaluations: 45, averageScore: 4.2, participants: 320, completedRate: 85 },
        { month: '2月', evaluations: 52, averageScore: 4.3, participants: 380, completedRate: 88 },
        { month: '3月', evaluations: 61, averageScore: 4.1, participants: 420, completedRate: 82 },
        { month: '4月', evaluations: 58, averageScore: 4.4, participants: 410, completedRate: 90 },
        { month: '5月', evaluations: 67, averageScore: 4.5, participants: 450, completedRate: 92 },
        { month: '6月', evaluations: 72, averageScore: 4.3, participants: 480, completedRate: 87 },
      ],
      topPerformers: [
        { name: '张教授', department: '计算机系', score: 4.8, evaluations: 12 },
        { name: '李老师', department: '数学系', score: 4.7, evaluations: 15 },
        { name: '王副教授', department: '物理系', score: 4.6, evaluations: 10 },
      ],
      departmentPerformance: [
        { department: '计算机系', averageScore: 4.3, evaluationCount: 850, trend: 'up' },
        { department: '数学系', averageScore: 4.1, evaluationCount: 720, trend: 'stable' },
        { department: '物理系', averageScore: 4.2, evaluationCount: 650, trend: 'up' },
      ],
    })),

    trends: jest.fn(() => Promise.resolve({
      evaluations: [
        { date: '2024-01-01', count: 45, score: 4.2 },
        { date: '2024-01-02', count: 48, score: 4.1 },
        { date: '2024-01-03', count: 52, score: 4.3 },
      ],
      participants: [
        { date: '2024-01-01', count: 320 },
        { date: '2024-01-02', count: 340 },
        { date: '2024-01-03', count: 360 },
      ],
    })),
  },

  teachers: {
    list: jest.fn(() => Promise.resolve({
      teachers: [
        {
          id: '1',
          username: 'teacher001',
          name: '张教授',
          email: 'zhang@example.com',
          department: '计算机系',
          title: '教授',
          phone: '13800138000',
          specialization: '人工智能',
          status: 'active',
          joinDate: '2020-09-01',
          lastLogin: '2024-01-15T10:30:00.000Z',
          evaluationCount: 25,
          averageScore: 4.5,
          createdAt: '2020-09-01T00:00:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
        {
          id: '2',
          username: 'teacher002',
          name: '李老师',
          email: 'li@example.com',
          department: '数学系',
          title: '副教授',
          phone: '13800138001',
          specialization: '应用数学',
          status: 'active',
          joinDate: '2019-03-15',
          lastLogin: '2024-01-14T09:15:00.000Z',
          evaluationCount: 30,
          averageScore: 4.3,
          createdAt: '2019-03-15T00:00:00.000Z',
          updatedAt: '2024-01-14T09:15:00.000Z',
        },
      ],
      total: 150,
      page: 1,
      pageSize: 10,
    })),

    create: jest.fn(() => Promise.resolve({ success: true })),
    update: jest.fn(() => Promise.resolve({ success: true })),
    delete: jest.fn(() => Promise.resolve({ success: true })),
  },

  courses: {
    list: jest.fn(() => Promise.resolve({
      courses: [
        {
          id: '1',
          code: 'CS101',
          name: '计算机基础',
          description: '计算机科学导论课程',
          credits: 3,
          hours: 48,
          department: '计算机系',
          teacher: {
            id: '1',
            name: '张教授',
            username: 'teacher001',
          },
          semester: '2024春季',
          academicYear: '2023-2024',
          status: 'active',
          studentCount: 45,
          maxStudents: 50,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
        },
        {
          id: '2',
          code: 'CS201',
          name: '数据结构',
          description: '数据结构与算法课程',
          credits: 4,
          hours: 64,
          department: '计算机系',
          teacher: {
            id: '2',
            name: '李老师',
            username: 'teacher002',
          },
          semester: '2024春季',
          academicYear: '2023-2024',
          status: 'active',
          studentCount: 40,
          maxStudents: 45,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-10T00:00:00.000Z',
        },
      ],
      total: 280,
      page: 1,
      pageSize: 10,
    })),
  },

  evaluations: {
    list: jest.fn(() => Promise.resolve({
      evaluations: [
        {
          id: '1',
          title: '期中教学质量评价',
          description: '2024年春季学期期中教学评价',
          teacher: {
            id: '1',
            name: '张教授',
            username: 'teacher001',
          },
          course: {
            id: '1',
            name: '计算机基础',
            code: 'CS101',
          },
          class: {
            id: '1',
            name: 'CS101-01',
            code: 'CS101-01',
          },
          evaluator: {
            id: '1',
            name: '管理员',
            type: 'admin',
          },
          type: 'summative',
          status: 'completed',
          startDate: '2024-01-10T00:00:00.000Z',
          endDate: '2024-01-20T23:59:59.000Z',
          responseCount: 40,
          totalParticipants: 45,
          averageScore: 4.5,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-20T23:59:59.000Z',
        },
      ],
      total: 3500,
      page: 1,
      pageSize: 10,
    })),

    create: jest.fn(() => Promise.resolve({ success: true })),
    update: jest.fn(() => Promise.resolve({ success: true })),
    generate: jest.fn(() => Promise.resolve({ success: true })),
  },

  analytics: {
    data: jest.fn(() => Promise.resolve({
      overview: {
        totalEvaluations: 3500,
        averageScore: 4.2,
        participationRate: 0.85,
        completionRate: 0.92,
      },
      trends: {
        monthly: [
          { month: '1月', evaluations: 250, averageScore: 4.1, participants: 2200 },
          { month: '2月', evaluations: 280, averageScore: 4.2, participants: 2450 },
          { month: '3月', evaluations: 320, averageScore: 4.3, participants: 2800 },
        ],
        departments: [
          { department: '计算机系', averageScore: 4.3, evaluations: 1200, trend: 'up' },
          { department: '数学系', averageScore: 4.1, evaluations: 980, trend: 'stable' },
          { department: '物理系', averageScore: 4.2, evaluations: 850, trend: 'up' },
        ],
        scoreDistribution: [
          { range: '优秀(4.5-5.0)', count: 875, percentage: 25 },
          { range: '良好(4.0-4.5)', count: 1400, percentage: 40 },
          { range: '一般(3.5-4.0)', count: 980, percentage: 28 },
          { range: '及格(3.0-3.5)', count: 245, percentage: 7 },
        ],
      },
      topPerformers: [
        { teacherId: '1', teacherName: '张教授', department: '计算机系', averageScore: 4.8, evaluationCount: 12 },
        { teacherId: '2', teacherName: '李老师', department: '数学系', averageScore: 4.7, evaluationCount: 15 },
        { teacherId: '3', teacherName: '王副教授', department: '物理系', averageScore: 4.6, evaluationCount: 10 },
      ],
      improvementAreas: [
        { aspect: '学生参与度', averageScore: 3.8, targetScore: 4.2, gap: 0.4, recommendation: '增加互动环节' },
        { aspect: '教学创新', averageScore: 3.9, targetScore: 4.3, gap: 0.4, recommendation: '引入新技术' },
        { aspect: '作业反馈', averageScore: 4.1, targetScore: 4.5, gap: 0.4, recommendation: '及时批改作业' },
      ],
    })),
  },

  reports: {
    templates: jest.fn(() => Promise.resolve({
      templates: [
        {
          id: 'teacher-performance',
          name: '教师表现报告',
          description: '综合分析教师教学表现和评价数据',
          category: 'performance',
          type: 'teacher',
        },
        {
          id: 'course-analysis',
          name: '课程分析报告',
          description: '深入分析课程教学效果和学生学习成果',
          category: 'analysis',
          type: 'course',
        },
      ],
    })),

    generate: jest.fn(() => Promise.resolve({
      success: true,
      reportUrl: '/reports/generated/sample-report.pdf',
    })),

    schedule: jest.fn(() => Promise.resolve({
      success: true,
      scheduleId: 'schedule-123',
    })),
  },

  system: {
    health: jest.fn(() => Promise.resolve({
      status: 'healthy',
      services: {
        database: 'up',
        api: 'up',
        websocket: 'up',
      },
    })),
  },
};

// Helper to setup fetch mock
export const setupFetchMock = () => {
  (global.fetch as jest.Mock).mockImplementation((url) => {
    const urlObj = new URL(url);
    const path = urlObj.pathname;

    // Route to appropriate handler based on URL
    if (path.startsWith('/api/auth/login')) {
      return mockHandlers.auth.login();
    }
    if (path.startsWith('/api/auth/logout')) {
      return mockHandlers.auth.logout();
    }
    if (path.startsWith('/api/auth/me')) {
      return mockHandlers.auth.getCurrentUser();
    }
    if (path.startsWith('/api/auth/profile')) {
      return mockHandlers.auth.updateProfile();
    }
    if (path.startsWith('/api/dashboard/stats')) {
      return mockHandlers.dashboard.stats();
    }
    if (path.startsWith('/api/dashboard/trends')) {
      return mockHandlers.dashboard.trends();
    }
    if (path.startsWith('/api/teachers')) {
      return mockHandlers.teachers.list();
    }
    if (path.startsWith('/api/courses')) {
      return mockHandlers.courses.list();
    }
    if (path.startsWith('/api/evaluations')) {
      return mockHandlers.evaluations.list();
    }
    if (path.startsWith('/api/analytics')) {
      return mockHandlers.analytics.data();
    }
    if (path.startsWith('/api/reports/templates')) {
      return mockHandlers.reports.templates();
    }
    if (path.startsWith('/api/reports/generate')) {
      return mockHandlers.reports.generate();
    }
    if (path.startsWith('/api/reports/schedule')) {
      return mockHandlers.reports.schedule();
    }
    if (path.startsWith('/api/system/health')) {
      return mockHandlers.system.health();
    }

    // Default fallback
    return Promise.resolve({
      success: false,
      message: 'Not found',
    });
  });
};

export default mockHandlers;