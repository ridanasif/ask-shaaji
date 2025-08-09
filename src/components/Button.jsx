const Button = ({ text, onClick }) => {
  return (
    <>
      <button
        className="bg-gray-100 hover:bg-gray-200 hover:ring-1 ring-gray-300 px-4 py-2 rounded-md cursor-pointer text-gray-600 text-sm"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};
export default Button;
