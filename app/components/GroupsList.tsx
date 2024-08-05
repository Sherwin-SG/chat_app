// GroupsList.tsx
import React from 'react';
import { Group } from '../types'; // Make sure this path is correct

interface GroupsListProps {
  groups: Group[];
  onSelectGroup: (group: Group) => void;
  selectedGroup: Group | null;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, onSelectGroup, selectedGroup }) => {
  return (
    <div>
      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => onSelectGroup(group)}
          className={`p-2 cursor-pointer ${selectedGroup?._id === group._id ? 'bg-blue-100' : ''}`}
        >
          {group.name}
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
