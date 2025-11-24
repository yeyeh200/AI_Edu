import React from 'react';

export const ReportBuilder: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">报表生成器</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">功能开发中</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        自定义报表生成功能正在开发中，敬请期待。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportBuilder;
