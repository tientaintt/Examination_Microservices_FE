import React, { useState, useEffect, useRef } from 'react';

import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAllSenderOfReceiverService, getMessagesService, sendMessageService } from '../../services/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';


const ChatBox = ({ senderId, buttonSize }) => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [reload, setReload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const clientRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const [showUserList, setShowUserList] = useState(false);
  useEffect(() => {

    document.getElementById("button_Icon").style.height = buttonSize + 'px'
    document.getElementById("button_Icon").style.width = buttonSize + 'px'
  }, [buttonSize])
  useEffect(() => {
    if (receiver) {
      const client = Stomp.over(() => new SockJS('http://localhost:8084/chat/ws', null, {
        transports: ['xhr-streaming', 'xhr-polling', 'websocket'],
        withCredentials: true,
      }));
      client.connect({}, () => {
        console.log("connected")
        client.subscribe(`/topic/chat/${senderId}`, (message) => {

          const chatMessage = JSON.parse(message.body);
          console.log("receiver data ", chatMessage);
          setMessages((prevMessages) => [chatMessage, ...prevMessages]);
          setReload(true);
        });
      });

      client.onStompError = (error) => {
        console.error('STOMP connection error:', error);
      };

      setConnected(true);
      fetchMessages();
    }
  }, [receiver]);


  const fetchMessages = async () => {
    if (receiver) {
      getMessagesService(senderId, receiver.id).then(res => {
        console.log(res.data)
        setMessages(res.data);
        setIsLoading(false)
      }).catch(console.error)
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const chatMessage = {
        sender: senderId,
        receiver: receiver.id,
        message: message,
      };

      sendMessageService(chatMessage).then(res => {
        console.log(res)
        const chatMessage1 = {
          senderId: senderId,
          receiverId: receiver.id,
          message: message,
        };
        setMessages(prev => [chatMessage1, ...prev])
        setMessage('')
      }).catch(console.error)
    }
  };
  const toggleUserList = () => {
    setShowUserList(!showUserList);
  };
  return (
    <>
      <div className="flex space-x-4 ">
        <div className="w-1/4">
          <button
            id='button_Icon'
            onClick={toggleUserList}
            className=" bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"

          >
            <FontAwesomeIcon icon={faComments} className="w-6 h-6 rounded-full" />
          </button>
          {showUserList && <div className='absolute right-0 w-96'><UserList onUserSelect={(user) => setReceiver(user)} receiverId={senderId} reload={reload} /></div>}
        </div>

        <div className="flex-1 absolute right-96 top-full">
          {showUserList && receiver && (
            <div className=" flex flex-col w-full max-w-md h-[400px] max-h-[400px] bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className='flex justify-between items-center bg-slate-100 p-4'>
                <div className='flex items-center'>
                  <div className='w-4 h-4 rounded-full bg-red-300 mr-2'></div>
                  <p>{receiver.displayName}</p>
                </div>
                <div>

                  <button className='text-gray-600 hover:text-gray-900' onClick={() => setReceiver(null)}>
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
              </div>
              <div className='p-4 h-[90%] grid grid-rows-6'>
                <div className=" row-span-5 space-y-4 mb-4 ">
                  <ul className='flex flex-col-reverse gap-2 h-full items-end overflow-y-auto'>
                    {
                      !isLoading && messages.map((dt) => {

                        if (dt.senderId === senderId) {

                          return <li className='flex w-full flex-row-reverse gap-2 items-start'>
                            <p className='p-2 rounded-xl bg-slate-100'>{dt.message}</p>
                          </li>
                        }

                        return <li className='flex w-full gap-1 items-start'>
                          <div className='w-8 h-8 bg-red-400 rounded-full'></div>
                          <p className='p-2 rounded-xl bg-slate-100 max-w-[96px] break-words'>{dt.message}</p>
                        </li>
                      })
                    }

                  </ul>

                  {
                    isLoading && <h4>Loading...</h4>
                  }
                </div>
                <div className="row-span-1 pb-4 flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className=" p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!connected}
                    className={`p-3 rounded-lg ${!connected ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold disabled:cursor-not-allowed`}
                  >
                    Send
                  </button>
                </div>
              </div>


            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default ChatBox;

const UserList = ({ onUserSelect, receiverId, reload }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(Number(0));
  const [totalElement, setTotalElement] = useState(0);
  const [hasMore, setHasMore] = useState(false)
  useEffect(() => {
    // getAllSenderOfReceiverService(receiverId, page, 5).then(
    //   res => {
    //     console.log(res.data)
    //     if (users == null)
    //       setUsers(res.data.data)
    //     else
    //       setUsers(prev =>
    //         res.data.data.forEach((user) => {
    //           var checkData=prev.find(data => data.userId == user.userId)
    //           if (checkData)
    //              prev.forEach(element=>{
    //             if(element.userId==checkData.userId)
    //               element=checkData
    //             })
    //           else
    //             prev.push(user)

    //         })
    //       )

    // }

    // )
    getAllSenderOfReceiverService(receiverId, page, 2).then(
      res => {
        console.log(res.data);
        setUsers(prev => {
          const newUsers = res.data.data;

          if (prev.length === 0) {
            return newUsers;
          }

          console.log('Previous users:', prev);
          const prevUserMap = prev.reduce((acc, user) => {
            acc[user.userId] = user;
            return acc;
          }, {});


          const updatedUsers = newUsers.map(user => {
            if (prevUserMap[user.userId]) {
              return { ...prevUserMap[user.userId], ...user };
            }
            return user;
          });

          console.log('Updated users:', updatedUsers);

          // Lấy ra các user từ prev mà không có trong newUsers
          const prevUsersNotInNew = prev.filter(user =>
            newUsers.some(newUser => newUser.userId === user.userId)
          );

          console.log('Prev users not in newUsers:', prevUsersNotInNew);

          // Kết hợp cả updatedUsers và prevUsersNotInNew để tạo ra allUsers
          const allUsers = [
            ...updatedUsers,
            ...prevUsersNotInNew
          ];
      

          return allUsers;
        });

        // Cập nhật tổng số kết quả và trạng thái "còn trang" hay không
        setTotalElement(res.data.maxResult);
        setHasMore(res.data.totalPage - 1 > res.data.currentPage);
      }
    );


  }, [page, reload]);

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <div
        id="scrollableDiv"
        className='h-[80px] overflow-y-auto scroll-smooth'
      >
        <InfiniteScroll
        className='w-full'
          scrollableTarget="scrollableDiv"
          dataLength={totalElement} // This is important field to render the next data
          next={() => setPage(page + 1)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          
          scrollThreshold={0.9}

        >
          {users.map((user) => {
            console.log(users)
            return (
              <div
                key={user.id}
                className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 relative"
                onClick={() => onUserSelect(user)}
              >
                {user.displayName}

                {user.unreadCount > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {user.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      {/* <ul className="space-y-2">
        {users.map((user) => {

          console.log(user)
          return <>
            <li
              key={user.id}
              className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 relative"
              onClick={() => onUserSelect(user)}
            >
        
              {user.displayName}


              {user.unreadCount > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {user.unreadCount}
                </div>
              )}
            </li>
          </>
        }

        )}

      </ul> */}
    </div>
  );
};


