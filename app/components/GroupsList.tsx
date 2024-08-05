import React from 'react';

interface Group {
  _id: string;
  name: string;
  members: string[];
}

interface GroupsListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  selectedGroup: Group | null;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, onSelectGroup, selectedGroup }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
      <ul className="list-disc pl-5">
        {groups.map((group) => (
          <li 
            key={group._id} 
            className={`mt-2 ${selectedGroup?._id === group._id ? 'bg-gray-200' : ''}`}
            onClick={() => onSelectGroup(group)}
          >
            <p className="font-semibold">{group.name}</p>
            <p>Members: {group.members.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsList;
