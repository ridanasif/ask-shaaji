export default function Logo({ className = "" }) {
  var h1Class = "logo " + className;
  return (
    <>
      <h1 className={h1Class}>
        <span className="text-blue-500 dark:text-white">S</span>
        <span className="text-red-500 dark:text-white">h</span>
        <span className="text-yellow-500 dark:text-white">a</span>
        <span className="text-blue-500 dark:text-white">a</span>
        <span className="text-green-500 dark:text-white">j</span>
        <span className="text-red-500 dark:text-white">i</span>
      </h1>
    </>
  );
}
