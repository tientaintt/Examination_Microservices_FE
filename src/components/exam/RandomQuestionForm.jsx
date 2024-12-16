import { useEffect, useState } from "react";
import { getAllActivateQuestionGroupService } from "../../services/ApiService";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function RandomQuestionForm({ onSave, subjectId, initialSelectedQuestions }) {
    const { t } = useTranslation();
    const [listQuestionGroup, setListQuestionGroup] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState(initialSelectedQuestions || []);
    const [selectedGroups, setSelectedGroups] = useState(new Set());
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('id');
    const [sortType, setSortType] = useState('asc');
    const [search, setSearch] = useState('');
    useEffect(() => {
        if (initialSelectedQuestions) {
            const groups = new Set(
                initialSelectedQuestions.map((q) => q.questionGroupId)
            );
            setSelectedGroups(groups);
        }
    }, [initialSelectedQuestions]);
    const handleSelectChange = (groupId) => {
        setSelectedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };

    const handleQuantityChange = (groupId, e, totalQuestion) => {
        let value = e.target.value;
        if (totalQuestion < Number(value)) {

            e.target.value = '';

        } else
            setSelectedQuestions((prev) => {
                const updatedQuestions = prev.filter((q) => q.questionGroupId !== groupId);
                if (value > 0) {
                    updatedQuestions.push({ questionGroupId: groupId, numberOfQuestion: parseInt(value, 10) });
                }
                return updatedQuestions;
            });
    };

    const fetchQuestionGroups = () => {
        getAllActivateQuestionGroupService(subjectId, page, sortType, sortBy, 4, search)
            .then((res) => {
                setListQuestionGroup(res.data.content);
                setTotalPages(res.data.totalPages);
            })
            .catch(() => {
                toast.error(t('Get question group failed!'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    useEffect(() => {
        fetchQuestionGroups();
    }, [page, sortBy, sortType, search]);

    return (
        <div>
            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder={t('Search question groups')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            {listQuestionGroup.map((group) => (
                <div key={group.id} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        checked={selectedGroups.has(group.id)}
                        onChange={() => handleSelectChange(group.id)}
                        className="mr-2"
                    />
                    <span className="mr-4 w-[30%] overflow-x-hidden" title={`Group ID: ${group.id} - ${group.name}`}>{`Group ID: ${group.id} - ${group.name}`}</span>
                    <span className="mr-4 w-[30%] ">{`Total number of question: ${group.totalQuestion}`}</span>

                    <input
                        type="number"
                        placeholder={t('Number of questions')}
                        value={
                            selectedQuestions.find((q) => q.questionGroupId === group.id)?.numberOfQuestion || ''
                        }
                        onChange={(e) => handleQuantityChange(group.id, e, group.totalQuestion)}
                        disabled={!selectedGroups.has(group.id)}
                        className="border p-2 rounded w-[40%]"
                    />
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded"
                >
                    {t('Previous')}
                </button>
                <span>{t('Page')} {page + 1} {t('of')} {totalPages}</span>
                <button
                    onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 bg-gray-300 text-gray-600 rounded"
                >
                    {t('Next')}
                </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center mt-4">
                <label className="mr-2">{t('Sort By')}:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded mr-2"
                >
                    <option value="id">{t('ID')}</option>
                    <option value="name">{t('Name')}</option>
                </select>
                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="asc">{t('Ascending')}</option>
                    <option value="desc">{t('Descending')}</option>
                </select>
            </div>

            <button
                onClick={() => onSave(selectedQuestions)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
                {t('Save selected questions')}
            </button>
        </div>
    );
}