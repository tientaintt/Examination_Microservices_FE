import { useTranslation } from "react-i18next";
import { setFormatDateYYYYMMDD } from "../../services/ApiService";
import { useState } from "react";

export default function TestForm({ test, onChange, onSave, openAddQuestionModal }) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});
    const currentDate = new Date().toISOString().split("T")[0];

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra ngày bắt đầu
        if (test.startDate < currentDate) {
            newErrors.startDate = t('Start date must be in the future');
        }

        // Kiểm tra ngày kết thúc
        if (test.endDate <= test.startDate) {
            newErrors.endDate = t('End date must be after start date');
        }

        // Kiểm tra điểm mục tiêu
        if (test.targetScore < 0 || test.targetScore > 10) {
            newErrors.targetScore = t('Target score must be between 0 and 10');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave();

        }
    };



    return (
        <div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('Exam name')}</label>
                <input
                    type="text"
                    placeholder={t('Enter test name')}
                    value={test.testName}
                    onChange={(e) => onChange({ ...test, testName: e.target.value })}
                    className="border p-2 rounded w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('Start date')}</label>
                <input
                    type="datetime-local"
                    value={setFormatDateYYYYMMDD(test.startDate)}
                    onChange={(e) => onChange({ ...test, startDate: new Date(e.target.value).getTime() })}
                    className="border p-2 rounded w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('End date')}</label>
                <input
                    type="datetime-local"
                    value={setFormatDateYYYYMMDD(test.endDate)}
                    onChange={(e) => onChange({ ...test, endDate: new Date(e.target.value).getTime() })}
                    className="border p-2 rounded w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('Duration (minutes)')}</label>
                <input
                    type="number"
                    placeholder={t('Enter duration')}
                    value={test.testingTime}
                    onChange={(e) => onChange({ ...test, testingTime: e.target.value })}
                    className="border p-2 rounded w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('Target score')}</label>
                <input
                    type="number"
                    placeholder={t('Enter target score')}
                    value={test.targetScore}
                    onChange={(e) => onChange({ ...test, targetScore: parseFloat(e.target.value) })}
                    className="border p-2 rounded w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
                {errors.targetScore && <p className="text-red-500 text-sm">{errors.targetScore}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">{t('Description')}</label>
                <textarea
                    placeholder={t('Enter description')}
                    value={test.description}
                    onChange={(e) => onChange({ ...test, description: e.target.value })}
                    className="border p-2 rounded w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
            </div>
            {
                openAddQuestionModal && <button
                    onClick={openAddQuestionModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600 transition duration-200 mr-2 "
                >
                    {t('Add question')}
                </button>
            }

            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
                {t('Save')}
            </button>
        </div>
    );
}