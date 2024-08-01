import React from 'react';

interface Friend {
  _id: string;
  name?: string;
  email?: string;
}

interface FriendsListProps {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, selectedFriend, onSelectFriend }) => {
  return (
    
    <div className="space-y-4">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className={`p-4 rounded-lg shadow-md cursor-pointer ${
            selectedFriend?._id === friend._id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
          }`}
          onClick={() => onSelectFriend(friend)}
        >
          <h3 className="text-lg font-semibold">{friend.name || friend.email}</h3>
          <p className="text-sm">{friend.email}</p>
        </div>
      ))}
    </div>
    
  );
};

export default FriendsList;
