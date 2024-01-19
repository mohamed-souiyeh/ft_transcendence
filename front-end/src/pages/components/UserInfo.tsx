import souiyeh from "../../assets/souiyeh.jpeg";

export default function UserInfo() {
  return (
    <div className="flex bg-purple bg-opacity-30  border-[2px] border-purple/20 rounded-3xl ">
      <div className=" bg-purple-sh-2 rounded-full h-48 w-48 grid place-content-center ml-6 mt-6 ">
        <div className="relative inline-block">
          <img className="rounded-full h-44 w-44  " src={souiyeh} />
          {/* if online */}
          {
            <span className="w-8 h-8 rounded-full bg-green  absolute bottom-0.5 right-0.5"></span>
          }
          {/* else */}
          {
            // <span className="w-9 h-9 rounded-full bg-gray border-2 border-none absolute bottom-0.5 right-0.5"></span>

          }
        </div>
      </div>
      <div className="grid place-content-center ">
        <p className="text-white font-bold text-xl ml-10">Mouhamed Souiyeh</p>

        <div className="flex pt-10 ml-10">
          <button className="text-white   bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4  focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Add friend
          </button>
          <button className="text-white   bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4  focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Block user
          </button>
          <button className="text-white   bg-purple ring-2 ring-purple hover:bg-gradient-to-l focus:ring-4  focus:ring-purple-sh-1 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}
