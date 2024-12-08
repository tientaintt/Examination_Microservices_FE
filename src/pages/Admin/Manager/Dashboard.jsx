import React, { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import { getReportTestsByMonthService, getReportTotalService } from '../../../services/ApiService';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';

// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
function Dashboard() {
    const { t } = useTranslation();
    const [counts, setCounts] = useState({
        totalTests: 0,
        totalSubjects: 0,
        totalStudent: 0
    });
    const [testStats, setTestStats] = useState([]);
    const [chartData, setChartData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // Nhãn cho các cột
        datasets: [
            {
                label: 'Sales for 2024 (in USD)', // Nhãn cho dữ liệu
                data: [3000, 2000, 1500, 4000, 5500, 3000, 4500], // Dữ liệu cột
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
                categoryPercentage: 1,    // Điều chỉnh khoảng cách giữa các nhóm cột
                barPercentage: 1,         // Điều chỉnh khoảng cách giữa các cột trong nhóm
            },
        ],
    })

    const getReportTotal = () => {
        getReportTotalService().then((res) => {
            console.log(res.data);
            setCounts(res.data);
        }).catch((e) => {
            toast.error('Error', {
                position: toast.POSITION.TOP_RIGHT,
            })
        })
    }
    const getReportTestsByMonth = () => {
        getReportTestsByMonthService().then(res => {
            console.log(res.data);
            const data = res.data;
            const months = Array.from({ length: 12 }, (_, i) => i + 1); // Tháng 1-12
            const tests = months.map((month) => {
                const foundData = data.find(dataItem => dataItem.month === month);
                return foundData ? foundData.numberOfTests : 0;
            });
            console.log(tests)
            setChartData({
                // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // Nhãn cho các cột
                labels: months.map((month) => `Month ${month}`),
                datasets: [
                    {
                        label: 'Tests created per month', // Nhãn cho dữ liệu
                        data: tests, // Dữ liệu cột
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1,

                    },
                ],
            })
        }).catch((e) => {
            toast.error('Error', {
                position: toast.POSITION.TOP_RIGHT,
            })
        })
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Vị trí của chú thích
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 15, // Giảm kích thước phông chữ
                    },

                },
            },
            y: {
                beginAtZero: true, // Bắt đầu từ 0 trên trục y
            },
        },
    };
    useEffect(() => {
        document.title = t('Admin dashboard');
        getReportTotal();
        getReportTestsByMonth();
    }, []);
    return (
        <>
            <div className=" w-full p-4 h-full ">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{t('Admin dashboard')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
                    <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">{t('Total students')}</h3>
                        <p className="text-3xl font-bold">{counts.totalStudent}</p>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">{t('Total tests')}</h3>
                        <p className="text-3xl font-bold">{counts?.totalTests}</p>
                    </div>
                    <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-semibold mb-2">{t('Total subjects')}</h3>
                        <p className="text-3xl font-bold">{counts?.totalSubjects}</p>
                    </div>
                </div>

                <div className="bg-slate-300 p-3 rounded-lg shadow-md h-auto max-w-screen-lg w-full mx-auto overflow-hidden">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center p-2">Test Statistics</h3>

                    <div className=" w-full overflow-hidden">
                        <Bar data={chartData} options={options} />
                    </div>
                </div>
            </div>
        </>
    );

}

export default Dashboard;