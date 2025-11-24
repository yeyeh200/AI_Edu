import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const ReportViewer: React.FC = () => {
    const { reportId } = useParams({ strict: false });
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate({ to: '/reports' })}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">报表查看</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-lg font-medium text-gray-900">报表详情</h2>
                    <p className="mt-1 text-sm text-gray-500">报表 ID: {reportId}</p>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-600">
                        这里是报表查看页面的占位符。后续将在此处展示生成的报表内容和图表。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;
