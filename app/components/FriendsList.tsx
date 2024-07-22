// components/FriendsList.tsx
import React from 'react';

// Define the types for the props
interface FriendsListProps {
  friends: Friend[];
  onSelectFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
}

interface Friend {
  _id: string;
  name?: string;
  email?: string;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onSelectFriend }) => {
  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id} onClick={() => onSelectFriend(friend)}>
            {friend.name || friend.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
