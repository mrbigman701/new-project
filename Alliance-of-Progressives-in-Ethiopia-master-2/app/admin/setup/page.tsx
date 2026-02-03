'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function AdminSetupPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
  }

  const runMigrations = async () => {
    setStatus('running')
    setMessage('')
    setLogs([])
    addLog('Starting migration setup...')

    try {
      // Call the setup API endpoint which handles everything server-side
      addLog('Connecting to Supabase...')
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Setup failed')
      }

      setLogs((prev) => [...prev, ...result.logs])
      setStatus('success')
      setMessage('✓ Setup completed successfully! You can now login to the admin panel.')
    } catch (error) {
      addLog(`✗ Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setStatus('error')
      setMessage(
        'Setup failed. Make sure your Supabase credentials are set in environment variables.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel Setup</CardTitle>
            <CardDescription>
              This utility will automatically set up your database tables and create the admin user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div>
              {status === 'idle' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Click the button below to automatically run the database migrations.
                  </p>
                </div>
              )}
              {status === 'running' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-yellow-600" />
                  <p className="text-sm text-yellow-700">Setting up your admin panel...</p>
                </div>
              )}
              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 font-semibold">{message}</p>
                    <p className="text-xs text-green-600 mt-1">
                      You can now go to <a href="/admin/login" className="underline font-semibold">/admin/login</a>
                    </p>
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-700">{message}</p>
                </div>
              )}
            </div>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-64">
                {logs.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={runMigrations}
              disabled={status === 'running'}
              className="w-full"
              size="lg"
            >
              {status === 'running' ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Running Setup...
                </>
              ) : (
                'Run Setup'
              )}
            </Button>

            {/* Credentials Info */}
            {status === 'success' && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <p className="font-semibold text-gray-800 mb-2">Admin Credentials:</p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> alliance.ape@gmail.com
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Password:</span> Alliance@!21#z
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
