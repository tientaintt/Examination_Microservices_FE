
export default function ModalCustom({ title, onClose, children }) {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-1/2 top-20 absolute " onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div >{children}</div>
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