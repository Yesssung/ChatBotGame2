import React from 'react';
import { Link } from 'react-router-dom'; // React Router를 이용해 페이지 이동

const Main: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen max-w-lg mx-auto border shadow-lg">
            <h1 className="text-2xl font-bold mb-8">장르 선택</h1>
            <div className="space-y-4">
                <Link to="/chat/romance">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">로맨스</button>
                </Link>
                <Link to="/chat/mystery">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">추리</button>
                </Link>
                <Link to="/chat/survival">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">생존</button>
                </Link>
                <Link to="/chat/simulation">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">시뮬레이션</button>
                </Link>
            </div>
        </div>
    );
};

export default Main;



