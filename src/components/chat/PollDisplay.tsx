
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';

interface PollData {
  question: string;
  options: string[];
  allowMultiple: boolean;
  votes: Record<string, number>;
  userVotes: string[];
}

interface PollDisplayProps {
  poll: PollData;
  onVote: (optionIndex: number) => void;
  totalVotes: number;
}

const PollDisplay: React.FC<PollDisplayProps> = ({ poll, onVote, totalVotes }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (poll.userVotes.includes(poll.options[index])) {
      return; // Already voted
    }

    if (poll.allowMultiple) {
      if (selectedOptions.includes(index)) {
        setSelectedOptions(selectedOptions.filter(i => i !== index));
      } else {
        setSelectedOptions([...selectedOptions, index]);
      }
    } else {
      setSelectedOptions([index]);
    }
  };

  const submitVote = () => {
    selectedOptions.forEach(index => onVote(index));
    setSelectedOptions([]);
  };

  const getVotePercentage = (option: string) => {
    const votes = poll.votes[option] || 0;
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const hasVoted = poll.userVotes.length > 0;

  return (
    <div className="bg-gray-50 border rounded-lg p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-blue-600">Poll</span>
      </div>
      
      <h4 className="font-medium mb-3">{poll.question}</h4>
      
      <div className="space-y-2">
        {poll.options.map((option, index) => {
          const votes = poll.votes[option] || 0;
          const percentage = getVotePercentage(option);
          const isSelected = selectedOptions.includes(index);
          const isVoted = poll.userVotes.includes(option);
          
          return (
            <div key={index} className="space-y-1">
              <Button
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  hasVoted ? 'cursor-default' : 'cursor-pointer'
                } ${isVoted ? 'bg-blue-100 border-blue-300' : ''}`}
                onClick={() => !hasVoted && handleOptionClick(index)}
                disabled={hasVoted}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="flex-1">{option}</span>
                  {hasVoted && (
                    <span className="text-sm text-gray-500">
                      {votes} ({percentage}%)
                    </span>
                  )}
                </div>
              </Button>
              {hasVoted && (
                <Progress value={percentage} className="h-1" />
              )}
            </div>
          );
        })}
      </div>
      
      {!hasVoted && selectedOptions.length > 0 && (
        <Button
          onClick={submitVote}
          className="w-full mt-3 bg-blue-500 hover:bg-blue-600"
        >
          Vote
        </Button>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
        {poll.allowMultiple && ' • Multiple selections allowed'}
      </p>
    </div>
  );
};

export default PollDisplay;
