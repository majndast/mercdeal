'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Shield, User } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const toggleRole = async (user: Profile) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    fetchUsers()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00adef]" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Uživatelé</h1>
        <span className="text-gray-500">{users.length} uživatelů</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uživatel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registrace</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.role === 'admin' ? (
                        <Shield className="w-5 h-5 text-[#00adef]" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <span className="font-medium">{user.full_name || 'Nepojmenovaný'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role === 'admin' ? 'Admin' : 'Zákazník'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('cs-CZ')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleRole(user)}
                    className="text-sm text-[#00adef] hover:underline"
                  >
                    {user.role === 'admin' ? 'Odebrat admin' : 'Nastavit admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
