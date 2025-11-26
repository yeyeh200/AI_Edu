import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, DocumentArrowDownIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface ReportDetails {
    id: string;
    teacher: string;
    score: number;
    createdAt: string;
}

export const ReportViewer: React.FC = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();

    const { data: reportData, isLoading, error } = useQuery<ReportDetails>({
        queryKey: ['report-details', reportId],
        queryFn: async () => {
            if (!reportId) {
                throw new Error('报表ID不能为空');
            }

            const response = await fetch(`/api/reports/download/${reportId}`);
            if (!response.ok) {
                throw new Error('获取报表详情失败');
            }
            const result = await response.json();
            return result.data; // 提取ApiResponse中的data字段
        },
        enabled: !!reportId,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/reports')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">报表查看</h1>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/reports')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">报表查看</h1>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
                        <p className="text-gray-600 mb-6">
                            无法加载报表详情，请检查报表ID是否正确或稍后重试。
                        </p>
                        <button
                            onClick={() => navigate('/reports')}
                            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                        >
                            返回报表列表
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const report = reportData;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/reports')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">报表详情</h1>
                </div>
                <button
                    onClick={() => {
                        // 下载报表功能
                        window.open(`/api/reports/download/${reportId}`, '_blank');
                    }}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    <span>下载报表</span>
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">教师评价报表</h2>
                        <span className="text-sm text-gray-500">报表 ID: {reportId}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                            <h3 className="text-sm font-medium text-gray-700">教师姓名</h3>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{report?.teacher || '未知教师'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">分</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-700">评价得分</h3>
                        </div>
                        <p className="text-2xl font-bold text-primary-600">{report?.score || 0}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                            <h3 className="text-sm font-medium text-gray-700">生成时间</h3>
                        </div>
                        <p className="text-sm text-gray-900">
                            {report?.createdAt ? new Date(report.createdAt).toLocaleString() : '未知时间'}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">评价详情</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">教学质量</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${((report?.score || 0) / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{report?.score || 0}/5</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">师生互动</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${((report?.score || 0) / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{report?.score || 0}/5</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">课程难度</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-600 h-2 rounded-full"
                                                style={{ width: `${((report?.score || 0) / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{report?.score || 0}/5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">改进建议</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>继续保持良好的教学质量，关注学生的学习反馈</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>增加课堂互动环节，提高学生参与度</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>根据学生水平适当调整课程难度</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;
