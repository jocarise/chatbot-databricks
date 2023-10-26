import { useState } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

enum USERS {
  CHATBOT,
  CLIENT,
}
interface Message {
  user: USERS;
  message: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [queryMessage, setQueryMessage] = useState('');

  const handleSubmit = async () => {
    if (queryMessage) {
      setIsLoading(true);
      const message = {
        user: USERS.CLIENT,
        message: queryMessage,
      };

      setMessages((prevState) => [...prevState, message]);
      setQueryMessage('');

      const response = await fetch(`/api/post-job`, {
        method: 'POST',
        body: JSON.stringify({
          query: queryMessage,
        }),
      });
      const data = await response.json();
      
      if (data) {
        const botMessage = {
          user: USERS.CHATBOT,
          // @ts-ignore
          message: data?.notebook_output?.result,
        };

        setMessages((prevState) => [...prevState, botMessage]);
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed w-96">
        <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
          <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
            <p className="text-lg font-semibold">Addi Bot</p>
            <button
              className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-4 h-80 overflow-y-auto">
            {messages.map(({ message, user }) => {
              return (
                <>
                  <div
                    className={`mb-2 ${
                      user === USERS.CLIENT ? 'text-right' : ''
                    } `}
                  >
                    <p
                      className={`rounded-lg py-2 px-4 inline-block ${
                        user === USERS.CLIENT
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } `}
                    >
                      {user === USERS.CLIENT && <>{message}</>}
                      {user !== USERS.CLIENT && (
                        <>
                          {isJsonString(message) ? (
                            <JsonView src={JSON.parse(message)} />
                          ) : (
                            <>{message}</>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </>
              );
            })}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={queryMessage}
              onChange={(event) => setQueryMessage(event.target.value)}
              // @ts-ignore
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              disabled={isLoading}
            >
              {!isLoading && <> Send </>}
              {isLoading && (
                <>
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
