import React from 'react';
import { Group } from '../types'; // Make sure this path is correct

interface GroupsListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  selectedGroup: Group | null;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, onSelectGroup, selectedGroup }) => {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => onSelectGroup(group)}
          className={`p-4 rounded-lg shadow-md cursor-pointer ${
            selectedGroup?._id === group._id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <p className="font-semibold">{group.name}</p>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
