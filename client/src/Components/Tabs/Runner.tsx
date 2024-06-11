import { useRunner } from "../../context/RunnerProvider";

const Runner = () => {
    const { languageMap, languageInfo, setLanguageInfo, run, output, setStdin } = useRunner();

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = event.target.value;
        const selectedVersion = languageMap[selectedLanguage]?.version ?? null;
        const aliases = languageMap[selectedLanguage]?.aliases ?? undefined;
        setLanguageInfo({ language: selectedLanguage, version: selectedVersion, aliases: aliases });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStdin(event.target.value);
    };

    return (
        <div className="text-black space-y-5" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <div className="space-y-2">
                <p className="text-3xl text-white font-poppins font-thin">
                    Run Code
                </p>
                <hr />
            </div>

            <div className="">
                <select
                    id="language"
                    value={languageInfo?.language ?? ''}
                    onChange={handleLanguageChange}
                    className="bg-gray-700 text-gray-50 p-3 rounded-md text-lg pr-20"
                >
                    {Object.entries(languageMap).map(([language, { version }]) => (
                        <option key={language} value={language}>
                            {`${language} (${version})`}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <textarea
                    name="stdin"
                    id="stdin"
                    rows={10}
                    cols={28}
                    placeholder="Write your input here"
                    className="bg-gray-700 rounded-md p-2 text-gray-50 text-lg"
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div
                className="text-center text-white bg-indigo-500 hover:bg-indigo-700 rounded-md p-1 text-xl cursor-pointer"
                onClick={run}
            >
                Run
            </div>

            <div className="space-y-2">
                <p className="text-white text-lg">Output:</p>
                <div
                    className="bg-gray-700 p-2 rounded-md text-gray-50 max-w-64 min-h-80 word-wrap text-lg overflow-auto"
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {output}
                </div>
            </div>
        </div>
    );
};

export default Runner;
