
export default function ModalCustom({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-1/3 relative" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                {children}
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-2xl"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}