'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Zadejte platný email'),
  password: z.string().min(6, 'Heslo musí mít alespoň 6 znaků'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/ucet'
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Nesprávný email nebo heslo'
        : error.message)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none transition"
            placeholder="vas@email.cz"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Heslo
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00adef] focus:border-transparent outline-none transition pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00adef] text-white py-3 rounded-lg font-semibold hover:bg-[#0095cc] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          Přihlásit se
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Nemáte účet?{' '}
          <Link href="/registrace" className="text-[#00adef] hover:underline font-medium">
            Zaregistrujte se
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-[#0d0d0d] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">★</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#0d0d0d]">Merc</span>
              <span className="text-2xl font-bold text-[#00adef]">Deal</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Přihlášení</h1>
          <p className="text-gray-600 mt-2">Vítejte zpět</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
