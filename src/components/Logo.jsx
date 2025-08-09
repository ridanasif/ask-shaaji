export default function Logo({ className = "" }) {
  var h1Class = "logo " + className;
  return (
    <>
      <h1 className={h1Class}>
        <span className="text-blue-500">S</span>
        <span className="text-red-500">h</span>
        <span className="text-yellow-500">a</span>
        <span className="text-blue-500">a</span>
        <span className="text-green-600">j</span>
        <span className="text-red-600">i</span>
      </h1>
    </>
  );
}
