'use client';

import { Message, useAssistant as useAssistant } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { Send, XCircle, Bot } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useUser, SignInButton } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';

const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  tool: 'purple',
  assistant: 'green',
  data: 'orange',
};

export default function Chat() {
  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    stop,
  } = useAssistant({ api: '/api/assistant' });

  const inputRef = useRef<HTMLInputElement>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const { user, isLoaded, isSignedIn } = useUser();
  const firstName: string = user?.firstName || "";
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
      setIsMessageSent(false);
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleSubmitButton = () => {
    setShowInfo(false);
    setIsMessageSent(true);
  };

  const handleStop = () => {
    setIsMessageSent(false);
    stop();
  };

  const prompts = [
    { text: "Could you share more about Bandaranayake College Gampaha?" },
    { text: "What exactly is the Xban 2024?" },
    { text: "Tell me what can I find in Xban 2024?" },
    { text: "Tell me more about you Trinex.." },
  ];

  function handleCard(text: string) {
    handleInputChange({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
  }

  const [isLoading, setIsLoading] = useState(true);

  // UseEffect to set a delay for loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || isLoading) {
    return <div className='min-h-screen flex flex-col text-center justify-center items-center content-center'>
      <h1 className='text-4xl mb-5 font-bold'>
        Loading
      </h1>
      {/* <p className='text-2xl'>
        <span className=' font-bold bg-black text-white'>TRINEX</span> Loading...
      </p> */}
    </div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col w-full max-w-3xl p-6 mx-auto mt-10">
        <div className="w-full max-w-3xl flex flex-col space-y-4 p-8 overflow-auto min-h-screen pb-40">
          {error != null && (
            <div className="relative px-6 py-4 text-white bg-red-500 rounded-lg">
              <span className="block sm:inline">
                Error: {(error as any).toString()}
              </span>
            </div>
          )}
          
            <>
              <div>
                <h1 className="text-3xl font-bold">Hey {firstName}!</h1>
                {/* <p className="text-lg mt-4">Welcome to Xban 2024 🌟 I&apos;m trinex and here to tell you more about Xban 2024!</p> */}
              </div>
              <hr />
            {/* {showInfo && (
              <div className="pt-48 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                {prompts.map((prompt, index) => (
                  <button
                    onClick={() => handleCard(prompt.text)}
                    key={index}
                    className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md border hover:border-violet-500 transition-colors duration-300"
                  >
                    <span>{prompt.text}</span>
                  </button>
                ))}
              </div>
            )} */}
            </>
          
          <div className="flex-grow overflow-auto space-y-4">
            {messages.map((m: Message) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xl flex flex-col items-start py-2 px-4 rounded-xl text-base leading-loose ${m.role === 'user' ? 'bg-gray-100 text-black' : 'bg-violet-100 text-gray-800'} shadow-md`}
                >
                  <div className="flex flex-row items-center">
                    {m.role !== 'user' && <Bot className="w-8 h-8 mr-2 p-1 text-violet-800 flex-shrink-0 border items-center bg-white rounded-full" />}
                    <ReactMarkdown className="flex-grow">{m.content}</ReactMarkdown>
                  </div>
                  {m.role === 'data' && (
                    <>
                      <span>{(m.data as any).description}</span>
                      <pre className="bg-gray-200 p-2 rounded-lg">
                        {JSON.stringify(m.data, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            ))}
            {status === 'in_progress' && (
              <div className="w-full h-8 max-w-md p-2 mb-8 bg-gray-300 rounded-lg dark:bg-gray-600 animate-pulse" />
            )}
          </div>
        </div>
<div className='flex flex-col justify-center items-center'>
        <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col items-center content-center p-4 bg-white mt-4 fixed bottom-0 pb-10">
          <div className="w-full flex flex-row justify-center content-center px-4 items-center">
            <input
              ref={inputRef}
              disabled={status !== 'awaiting_message'}
              className="flex-grow px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full text-black"
              value={input}
              placeholder="Send me a text message!"
              onChange={handleInputChange}
            />
            {isMessageSent ? (
              <button
                className="p-2 ml-2 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-full flex content-center justify-center items-center"
                onClick={handleStop}
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            ) : (
              <button
                onClick={handleSubmitButton}
                type="submit"
                className="p-2 ml-2 bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-full flex content-center justify-center items-center"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          <p className="text-xs mt-2 text-slate-400 hover:text-slate-700">
            <sup>*</sup>Please do not share any private information with the chatbot.
          </p>
        </form>
        </div>
      </div>
    </>
  );
}
