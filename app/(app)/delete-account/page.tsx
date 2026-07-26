'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog'
import { deleteAccountAction } from '@/modules/privacy/actions'

export default function DeleteAccountPage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    await deleteAccountAction()
    // redirect is handled by action
  }

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-8 pt-12">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Hapus Akun</CardTitle>
          <CardDescription>Tindakan ini tidak dapat dibatalkan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Menghapus akun akan menghapus seluruh data profil, riwayat jeda, dan catatan finansial kamu dari sistem kami secara permanen.
          </p>
          <Button variant="destructive" onClick={() => setOpen(true)} className="w-full">
            Hapus Akun Saya
          </Button>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        isLoading={loading}
      />
    </div>
  )
}
