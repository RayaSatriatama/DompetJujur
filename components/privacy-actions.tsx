'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Trash2, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export function PrivacyActions() {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDeleteHistory = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      alert('Riwayat berhasil dihapus (simulasi)')
      router.refresh()
    }, 1500)
  }

  const handleDeleteAccount = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      alert('Akun berhasil dihapus (simulasi)')
      router.push('/login')
    }, 1500)
  }

  return (
    <div className="w-full space-y-3 mt-12 mb-6">
      <Button 
        variant="outline" 
        className="w-full h-14 rounded-xl text-base font-bold justify-start px-6 border-border/60 hover:bg-muted/30"
        onClick={() => alert('Mengunduh data... (simulasi)')}
      >
        <Download className="w-5 h-5 mr-3 text-muted-foreground" />
        Unduh data
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full h-14 rounded-xl text-base font-bold justify-start px-6 border-border/60 hover:bg-muted/30">
            <Trash2 className="w-5 h-5 mr-3 text-muted-foreground" />
            Hapus riwayat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-2xl w-[90%] p-6">
          <DialogHeader className="flex flex-col items-center justify-center pt-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
               <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">Hapus Riwayat?</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Semua catatan jeda akan dihapus dan tidak bisa dikembalikan. Baseline keuanganmu tetap ada.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              variant="destructive" 
              className="w-full h-12 rounded-xl font-bold"
              onClick={handleDeleteHistory}
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya, hapus riwayat'}
            </Button>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold"
              >
                Batal
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full h-14 rounded-xl text-base font-bold justify-start px-6 border-destructive text-destructive hover:bg-destructive/10">
            <Trash2 className="w-5 h-5 mr-3 text-destructive" />
            Hapus akun & data
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-2xl w-[90%] p-6">
          <DialogHeader className="flex flex-col items-center justify-center pt-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
               <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">Hapus Akun & Data?</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Ini akan menghapus seluruh datamu dari sistem, termasuk profil dan riwayat. Tindakan ini permanen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              variant="destructive" 
              className="w-full h-12 rounded-xl font-bold"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya, hapus permanen'}
            </Button>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold"
              >
                Batal
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
