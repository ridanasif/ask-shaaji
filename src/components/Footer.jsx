export default function Footer() {
  return (
    <>
      <footer className="w-full bg-gray-100 py-3">
        <div className="flex flex-col gap-y-2">
          <span className="px-4 sm:px-6 lg:px-10 text-sm">India</span>
          <div className="w-full h-[1px] bg-gray-300"></div>
          <div className="flex flex-col sm:flex-row px-4 sm:px-6 lg:px-10 text-sm gap-y-3 sm:gap-y-0 sm:justify-between">
            <ul className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2">
              <li className="hover:underline cursor-pointer">Advertising</li>
              <li className="hover:underline cursor-pointer">Business</li>
              <li className="hover:underline cursor-pointer">
                How Search Works
              </li>
            </ul>
            <ul className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-2">
              <li className="hover:underline cursor-pointer">Privacy</li>
              <li className="hover:underline cursor-pointer">Terms</li>
              <li className="hover:underline cursor-pointer">Settings</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
