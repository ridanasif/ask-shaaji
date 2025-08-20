const NotFound = () => {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center flex-col bg-gray-100 p-5">
          <img src="mascot-head.png" className="w-28" />
          <h1 className="text-3xl font-bold text-gray-700">404.</h1>
          <h1 className="text-sm md:text-base lg:text-lg font-black text-gray-700 text-center">
            മോനേ, നീയിവിടെ നോക്കിയത് കിട്ടില്ല! കമ്പ്യൂട്ടറിലിങ്ങനെ
            കുത്തിയിരുന്നാൽ പലതും മിസ്സാകും. വല്ല പണിക്കും പോയി ജീവിക്ക്, പോ!
          </h1>
        </div>
      </>
    );
};
export default NotFound;