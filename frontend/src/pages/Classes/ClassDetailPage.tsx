import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const ClassDetailPage: React.FC = () => {
    const { classId } = useParams({ strict: false });
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate({ to: '/classes' })}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">班级详情</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-lg font-medium text-gray-900">班级信息</h2>
                    <p className="mt-1 text-sm text-gray-500">班级 ID: {classId}</p>
                </div>

                <div className="prose max-w-none">
                    <p className="text-gray-600">
                        这里是班级详情页面的占位符。后续将在此处展示班级成员、课程表、班级表现等数据。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailPage;
