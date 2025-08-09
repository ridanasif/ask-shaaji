export default function Footer() {
  return (
    <>
      <footer className="w-full bg-gray-100 py-3">
        <div className="flex flex-col gap-y-2">
          <span className="px-10 text-sm">India</span>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="flex px-10 text-sm justify-between">
            <ul className="flex gap-x-5">
              <li>Advertising</li>
              <li>Business</li>
              <li>How Search Works</li>
            </ul>
            <ul className="flex gap-x-5">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Settings</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
