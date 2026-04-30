import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUsers, FaChartBar, FaCreditCard, FaCheckCircle, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  investmentBalance: number;
  isVerified: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  totalInvestedBalance: number;
  unverifiedUsers: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Check if user is admin
    if (user.role !== 'admin') {
      navigate('/');
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch users
      const usersResponse = await axios.get(`${API_BASE_URL}/api/admin/users`, { headers });
      setUsers(usersResponse.data.users);

      // Fetch stats
      const statsResponse = await axios.get(`${API_BASE_URL}/api/admin/stats`, { headers });
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEditUser = (userData: User) => {
    setSelectedUser(userData);
    setEditFormData(userData);
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/users/${selectedUser?._id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((u) => (u._id === selectedUser?._id ? response.data.user : u))
      );
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <motion.header
        className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">FulxerPro Admin</h1>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <motion.div
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Users</p>
                <p className="text-4xl font-bold text-white">{stats?.totalUsers}</p>
              </div>
              <FaUsers className="text-indigo-400 text-4xl" />
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Verified Users</p>
                <p className="text-4xl font-bold text-white">{stats?.verifiedUsers}</p>
              </div>
              <FaCheckCircle className="text-green-400 text-4xl" />
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Invested</p>
                <p className="text-4xl font-bold text-white">${stats?.totalInvestedBalance.toFixed(2)}</p>
              </div>
              <FaCreditCard className="text-yellow-400 text-4xl" />
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Unverified</p>
                <p className="text-4xl font-bold text-white">{stats?.unverifiedUsers}</p>
              </div>
              <FaChartBar className="text-purple-400 text-4xl" />
            </div>
          </motion.div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white">Users Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Balance</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-blue-900/30 text-blue-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      ${user.investmentBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isVerified
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}
                      >
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEditUser(user)}
                          className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEdit className="text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaTrash className="text-white" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-slate-900 rounded-lg border border-slate-800 p-8 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Edit User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={editFormData.firstName || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={editFormData.lastName || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Investment Balance</label>
                <input
                  type="number"
                  value={editFormData.investmentBalance || 0}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      investmentBalance: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Verified</label>
                <select
                  value={editFormData.isVerified ? 'yes' : 'no'}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      isVerified: e.target.value === 'yes',
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <motion.button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

