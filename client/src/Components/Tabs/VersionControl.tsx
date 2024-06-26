const VersionControl = () => {
    return (
        <div className="text-white min-w-72 max-w-72 h-full flex flex-col space-y-10">
            <div className="space-y-2">
                <p className="text-3xl font-poppins font-thin">
                    Version Control
                </p>
                <hr />
            </div>

            <div className="overflow-y-auto p-2 flex-grow">
                <div className="grid grid-cols-2 gap-2">
                    <button className="text-xl bg-blue-600 p-2 rounded-md hover:bg-blue-700">Stage Changes</button>
                    <button className="text-xl bg-red-600 p-2 rounded-md hover:bg-red-700">Commit Changes</button>
                    <button className="text-xl bg-slate-900 p-2 rounded-md hover:bg-slate-950">View Commits</button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="">
                    Output:
                </div>
                <div className="bg-gray-700 min-h-36 max-h-56 p-2 rounded-lg overflow-auto">
                    {/* Output here */}
                </div>
            </div>
        </div>
    );
};

export default VersionControl;
