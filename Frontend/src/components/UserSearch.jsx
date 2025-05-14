import { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const UserSearch = ({ showOnlineOnly }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { onlineUsers } = useAuthStore();
  const { setSelectedUser } = useChatStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('Please enter a username to search');
      return;
    }

    try {
      setIsSearching(true);
      const response = await axiosInstance.get(`/auth/search?username=${searchTerm}`);
      const results = response.data;
      
      // Filter results if showOnlineOnly is true
      const filteredResults = showOnlineOnly 
        ? results.filter(user => onlineUsers.includes(user._id))
        : results;
      
      setSearchResults(filteredResults);
      
      if (filteredResults.length === 0) {
        toast.error(showOnlineOnly ? 'No online users found' : 'No users found');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error(error.response?.data?.message || 'Error searching users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <div className="p-4 border-b border-base-300">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username..."
            className="input input-bordered w-full pr-10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-base-content/70">Search Results</h3>
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-base-content/70">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(user)}
                  className="btn btn-sm btn-primary gap-2"
                >
                  <UserPlus size={16} />
                  <span className="hidden sm:inline">Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;