import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllActiveQuestionByIdClassroomService } from "../../services/ApiService";
import { toast } from "react-toastify";

export default function ManualQuestionForm({ onSave, subjectId ,initialSelectedQuestions}) {
    const { t } = useTranslation();
    const [listAllQuestion, setListAllQuestion] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState(initialSelectedQuestions || []);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('id');
    const [sortType, setSortType] = useState('asc');
    const [search, setSearch] = useState('');

    const handleSelectChange = (questionId) => {
        setSelectedQuestions((prevSelected) => {
            if (prevSelected.includes(questionId)) {
                return prevSelected.filter((id) => id !== questionId);
            } else {
                return [...prevSelected, questionId];
            }
        });
    };

    const fetchQuestions = () => {
        getAllActiveQuestionByIdClassroomService(subjectId, page, sortType, sortBy, 5, search)
            .then((res) => {
                setListAllQuestion(res.data.content);
                setTotalPages(res.data.totalPages);
            })
            .catch((error) => {
                toast.error(t('Get question failed!'), {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    useEffect(() => {
        fetchQuestions();
    }, [page, sortBy, sortType, search]);

    return (
        <div>
            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder={t('Search questions')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            {/* List of Questions with Checkbox */}
            {listAllQuestion.map((question) => (
                <div key={question.id} className="flex items-center mb-2 flex-row">
                    <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleSelectChange(question.id)}
                        className="mr-2"
                    />
                    <span className="mr-4" dangerouslySetInnerHTML={{ __html: `Question ID: ${question.id}` }}></span>
                    <span className="mr-4" > - </span>
                    <span className="mr-4" dangerouslySetInnerHTML={{ __html: `${question.content}` }}></span>
               
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
                    <option value="content">{t('Content')}</option>
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