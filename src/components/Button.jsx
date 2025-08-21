const Button = ({ text, onClick }) => {
  return (
    <>
      <button
        className="dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 dark:ring-neutral-700 bg-gray-100 hover:bg-gray-200 hover:ring-1 ring-gray-300 px-4 py-2 rounded-md cursor-pointer text-gray-600 text-sm"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};
export default Button;
