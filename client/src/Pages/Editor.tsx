import CodeEditor from "../Components/CodeEditor/CodeEditor"
import config from "../Config"
import PageMeta from "../Utils/PageMeta"
import { useRoom } from "../context/RoomProvider.tsx"
import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Loader from "../Components/Loader";


const Editor = () => {
  const { isValidRoom, joinRoom } = useRoom();
  const { id } = useParams();
  const [loading, setLoading] = useState<Boolean>(true);
  const [isValid, setIsValid] = useState<Boolean | null>(false);
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    isValidRoom(id as string).then((data) => {
      setIsValid(data);
      setLoading(false);
      joinRoom(id);
    });
  }, [id]);

  if (loading) {
    return <Loader fullScreen={true} size={52} type="spinner" />
  }

  if (!loading && !isValid) {
    return (
      <div className="bg-gray-700 h-screen flex justify-center items-center">
        <div className="text-center text-xl sm:text-3xl space-y-8">
          <div className="space-y-2">
            <p>This room you are trying to join do not exist.</p>
            <p className="mb-3">Check the Room Id and try again!!</p>
          </div>
          <div>
            <Link className="bg-indigo-900 text-indigo-50 hover:bg-indigo-700 hover:text-indigo-200 rounded-md p-3" to="/">Go home</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && isValid)
    return (

      <div>
        <PageMeta title="Editor | CodeSync" description="CodeSync helps to collaborate on code in real-time with your team. Experience seamless, multi-user coding with our online code editor. Check out now!" canonical={`${config.FRONTEND_URL}/editor`} />
        <CodeEditor />
      </div>
    )
}

export default Editor
