import React, { useEffect } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Typesend from "./Typesend";
import useConversation from "../../statemanage/useConversation.js";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { CiMenuFries } from "react-icons/ci";
import sound from "../../assets/notification.mp3";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { isConnected } = useSocketContext();
  
  // Only clear selection on unmount, not immediately on mount.
  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);
  
  const testNotification = () => {
    try {
      const notification = new Audio(sound);
      notification.volume = 0.7;
      notification.play();
      
      // Also test browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Test Notification", {
          body: "This is a test notification sound!",
          icon: "/vite.svg"
        });
      }
    } catch (error) {
      console.log("Error testing notification:", error);
    }
  };
  
  return (
    <div className="w-full bg-zinc-900 text-gray-300">  
      {/* Socket Connection Status */}
      <div className={`px-4 py-2 text-sm flex justify-between items-center ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
        <span>Socket: {isConnected ? 'Connected' : 'Disconnected'}</span>
        <button 
          onClick={testNotification}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
        >
          Test Sound
        </button>
      </div>
      
      <div>
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <>
            <Chatuser />
            <div
              className=" flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(88vh - 8vh)" }}
            >
              <Messages />
            </div>
            <Typesend />
          </>
        )}
      </div>
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="relative">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden absolute left-5"
        >
          <CiMenuFries className="text-white text-xl" />
        </label>
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-center">
            Welcome{" "}
            <span className="font-semibold text-xl">
              {authUser?.fullname || authUser?.user?.fullname || "Friend"}
            </span>
            <br />
            No chat selected, please start conversation by selecting anyone to
            your contacts
          </h1>
        </div>
      </div>
    </>
  );
};