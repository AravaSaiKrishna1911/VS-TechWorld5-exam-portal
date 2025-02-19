import { useState, useEffect } from 'react';
import { PlusIcon, BuildingOfficeIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';

function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '' });
  const [newAdmin, setNewAdmin] = useState({
    organizationId: '',
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          organization_admins (
            id,
            user_id,
            active
          )
        `)
        .eq('active', true);

      if (error) throw error;

      setOrganizations(data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrganization = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('organizations')
        .insert([
          { 
            name: newOrg.name,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setOrganizations([...organizations, { ...data, organization_admins: [] }]);
      setNewOrg({ name: '' });
      setShowAddOrg(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Create new user with admin role
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: {
          data: {
            full_name: newAdmin.name,
            role: 'admin'
          }
        }
      });

      if (signUpError) throw signUpError;

      // Add admin to organization
      const { error: adminError } = await supabase
        .from('organization_admins')
        .insert([
          {
            organization_id: newAdmin.organizationId,
            user_id: user.id,
            created_by: (await supabase.auth.getUser()).data.user.id
          }
        ]);

      if (adminError) throw adminError;

      await fetchOrganizations();
      setNewAdmin({
        organizationId: '',
        email: '',
        password: '',
        name: ''
      });
      setShowAddAdmin(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Super Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddOrg(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Organization
          </button>
          <button
            onClick={() => setShowAddAdmin(true)}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold dark:text-white">Organizations</h3>
              <p className="text-2xl font-bold text-blue-500">{organizations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold dark:text-white">Total Admins</h3>
              <p className="text-2xl font-bold text-green-500">
                {organizations.reduce((acc, org) => acc + org.organization_admins.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold dark:text-white">Active Exams</h3>
              <p className="text-2xl font-bold text-purple-500">
                {organizations.reduce((acc, org) => acc + (org.active_exams || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Organization Modal */}
      {showAddOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Organization</h2>
            <form onSubmit={handleAddOrganization}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ name: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddOrg(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Admin</h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Organization
                </label>
                <select
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newAdmin.organizationId}
                  onChange={(e) => setNewAdmin({ ...newAdmin, organizationId: e.target.value })}
                  required
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Admin Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Organizations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-3 dark:text-gray-300">Organization</th>
                  <th className="pb-3 dark:text-gray-300">Admins</th>
                  <th className="pb-3 dark:text-gray-300">Created At</th>
                  <th className="pb-3 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map(org => (
                  <tr key={org.id} className="border-b dark:border-gray-700">
                    <td className="py-4 dark:text-white">{org.name}</td>
                    <td className="py-4 dark:text-white">{org.organization_admins.length}</td>
                    <td className="py-4 dark:text-white">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => {/* Implement edit */}}
                        className="text-blue-500 hover:text-blue-600 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {/* Implement delete */}}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;