import {
  Lock,
  Mail,
  Shield,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import {
  fetchAllUsers,
  createNewUser,
  updateUserRoleService,
  deleteUserService,
} from "../../services/adminUserService";
import { useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // load users :
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers();

      if (response.success) {
        setUsers(response.data?.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await createNewUser(formData);

      if (response.success) {
        console.log("What does the backend send?", response);
        // adds new users to the list instantly

        const user = response.data.user;

        setUsers((prevUser) => [user, ...prevUser]);

        // reset form:
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "customer",
        });
      }
    } catch (error) {
      console.log("error", error.response);
      console.error("Failed to create user", error);
      setError(error.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const prevUsers = users;
    setUsers((users) =>
      users.map((user) =>
        user?._id === userId
          ? { ...user, role: newRole === "admin" ? "admin" : "user" }
          : user,
      ),
    );

    const normalizedRole = newRole === "customer" ? "user" : "admin";

    try {
      await updateUserRoleService(userId, normalizedRole);
    } catch (error) {
      console.error("Failed update role");
      alert(error.response?.data?.message || "Failed to update role");
      setUsers(prevUsers); // rollback on failure
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const previousUsers = users;
    setUsers((users) => users.filter((user) => user._id !== userId));

    try {
      await deleteUserService(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
      setUsers(previousUsers); // rollback on failure    }
    }
  };

  const isAdmin = (role) => {
    return role === "admin";
  };
  const adminCount = users.filter((user) => isAdmin(user.role)).length;
  const customerCount = users.filter((user) => !isAdmin(user.role)).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {" "}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {" "}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Administrators</p>
                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerCount}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add new user form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg mr-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <p className="text-sm text-gray-600">Create a new user account</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {" "}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="role"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              {submitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          {" "}
          <h3 className="text-xl font-bold text-gray-900">User List</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage existing users and their roles
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users &&
                users.map((user) => {
                  return (
                    <tr
                      key={user?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {" "}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            <span className="font-semibold text-gray-900">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user?.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          name="role"
                          value={isAdmin(user.role) ? "admin" : "user"}
                          onChange={(e) =>
                            handleRoleChange(user?._id, e.target.value)
                          }
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none transition-all"
                        >
                          {" "}
                          <option value="customer">Customer</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {users &&
            users.map((user) => {
              console.log("user", user);
              return (
                <>
                  <div
                    className="p-4 hover:bg-gray-50 transition-colors"
                    key={user._id}
                  >
                    {" "}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Role
                      </label>
                      <select
                        value={isAdmin(user.role) ? "admin" : "user"}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </button>
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
