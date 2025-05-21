// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { ApiSettingsResponse, AppSettings, ApiUpdateSettingsResponse } from '@/types/settings';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';


// Skema Zod - PASTIKAN NAMA FIELD DI SINI SAMA DENGAN KEY DI AppSettings (dan backend)
// dan tipenya cocok dengan tipe setelah casting di backend.
const settingsFormSchema = z.object({
  nama_aplikasi: z.string().min(1, "Nama aplikasi diperlukan").max(100).optional().nullable(),
  email_kontak_admin: z.string().email("Email tidak valid").optional().nullable(),
  enable_inventory_alerts: z.boolean().optional(),
  enable_maintenance_reminders: z.boolean().optional(),

  default_laboratory_view: z.enum(['grid', 'list']).optional(),
  items_per_page: z.coerce.number().int().min(5).max(100).optional(),
  confirm_before_deleting: z.boolean().optional(),
  require_admin_approval: z.boolean().optional(), // Untuk student booking approval

  notify_inventory_updates: z.boolean().optional(),
  notify_low_stock: z.boolean().optional(),
  notify_lab_bookings: z.boolean().optional(),
  notify_student_due_reminders: z.boolean().optional(),

  user_registration_mode: z.enum(['open', 'approval', 'closed']).optional(),
  max_borrowings_per_student: z.coerce.number().int().min(1).max(20).optional(),
  auto_suspend_overdue: z.boolean().optional(),
  allow_multiple_lab_bookings: z.boolean().optional(),

  default_admin_role_permission: z.enum(['full', 'inventory', 'bookings', 'readonly']).optional(),
  require_2fa_admin: z.boolean().optional(),
  keep_admin_action_logs: z.boolean().optional(),

  lab_booking_window_days: z.coerce.number().int().min(1).max(90).optional(),
  lab_max_booking_duration_hours: z.coerce.number().int().min(1).max(24).optional(),
  lab_allow_weekend_bookings: z.boolean().optional(),
  lab_auto_approve_faculty_bookings: z.boolean().optional(),
  lab_enforce_capacity_limits: z.boolean().optional(),

  deskripsi_aplikasi: z.string().max(255).optional().nullable(), // Contoh field tambahan
  maks_hari_peminjaman: z.coerce.number().int().min(1).max(30).optional().nullable(), // Contoh field tambahan
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

const SettingsPage: React.FC = () => {
  const { token, isAdmin, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [settingsDataFromApi, setSettingsDataFromApi] = useState<AppSettings | null>(null); // Untuk menyimpan data asli dari API
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Hapus state `error` jika tidak digunakan untuk menampilkan pesan error di UI secara persisten

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {}, // Akan diisi dari API
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token || !isAdmin) { setIsLoadingData(false); if (isAuthenticated && !isAdmin) toast.error("Akses ditolak."); return; }
      setIsLoadingData(true);
      try {
        const response = await axiosInstance.get<ApiSettingsResponse>('/api/settings', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.success) {
          setSettingsDataFromApi(response.data.data);
          // Reset form dengan nilai dari API. Pastikan field di kiri (nama di Zod)
          // dan field di kanan (response.data.data.KEY_DARI_BACKEND) konsisten namanya.
          // Atau lakukan mapping jika namanya berbeda.
          form.reset(response.data.data as SettingsFormData); // Casting dengan asumsi nama field sudah cocok
        } else { throw new Error(response.data.message || "Gagal memuat pengaturan."); }
      } catch (err: any) { toast.error(err.response?.data?.message || err.message || "Terjadi kesalahan."); }
      finally { setIsLoadingData(false); }
    };
    if (!authLoading && isAuthenticated) fetchSettings();
    else if (!authLoading && !isAuthenticated) setIsLoadingData(false);
  }, [token, isAdmin, form, authLoading, isAuthenticated]);

  const onSubmitForm = async (data: SettingsFormData) => {
    if (!token || !isAdmin) { toast.error("Aksi tidak diizinkan."); return; }
    setIsSaving(true);
    try {
      const response = await axiosInstance.patch<ApiUpdateSettingsResponse>('/api/settings', data, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        toast.success(response.data.message || "Pengaturan berhasil disimpan.");
        if (response.data.data) { // Jika backend mengembalikan data baru
          setSettingsDataFromApi(response.data.data);
          form.reset(response.data.data as SettingsFormData);
        } else { // Jika tidak, reset dengan data form saat ini (optimistic) atau fetch ulang
          form.reset(data); // Anggap data form adalah yang terbaru dan sudah valid
        }
      } else { throw new Error(response.data.message || "Gagal menyimpan pengaturan."); }
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) { Object.values(errorData.errors).flat().forEach((msg: any) => toast.error(msg)); }
      else { toast.error(errorData?.message || "Gagal menyimpan pengaturan."); }
    } finally { setIsSaving(false); }
  };

  if (authLoading || isLoadingData) return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2 text-muted-foreground">Memuat...</p></div>;
  if (!authLoading && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!authLoading && !isAdmin) return <Navigate to="/dashboard" replace />;
  // Tidak perlu cek error && !settingsDataFromApi di sini karena UI form akan kosong jika fetch gagal

  return (
    <motion.div className="max-w-4xl mx-auto space-y-8" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">Kelola konfigurasi umum untuk aplikasi LabSys.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="general">Umum</TabsTrigger>
              <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
              <TabsTrigger value="users">Pengguna</TabsTrigger>
              <TabsTrigger value="labs">Laboratorium</TabsTrigger>
            </TabsList>

            {/* --- TAB GENERAL --- */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Informasi Aplikasi</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="nama_aplikasi" render={({ field }) => (<FormItem><FormLabel>Nama Aplikasi</FormLabel><FormControl><Input placeholder="Contoh: LabSys FT" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="deskripsi_aplikasi" render={({ field }) => (<FormItem><FormLabel>Deskripsi Aplikasi</FormLabel><FormControl><Textarea placeholder="Deskripsi singkat..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="email_kontak_admin" render={({ field }) => (<FormItem><FormLabel>Email Kontak Admin</FormLabel><FormControl><Input type="email" placeholder="admin@example.com" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>)}/>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Preferensi Sistem</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="default_laboratory_view" render={({ field }) => (<FormItem><FormLabel>Tampilan Default Laboratorium</FormLabel><ShadSelect onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="grid">Grid</SelectItem><SelectItem value="list">List</SelectItem></SelectContent></ShadSelect><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="items_per_page" render={({ field }) => (<FormItem><FormLabel>Item per Halaman (Inventaris, dll.)</FormLabel><ShadSelect onValueChange={(v)=>field.onChange(Number(v))} value={String(field.value ?? 10)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></ShadSelect><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="confirm_before_deleting" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Konfirmasi Sebelum Hapus</FormLabel><FormDescription>Tampilkan dialog konfirmasi sebelum menghapus data.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)}/>
                  <FormField control={form.control} name="require_admin_approval" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Approval Booking Mahasiswa</FormLabel><FormDescription>Peminjaman oleh mahasiswa memerlukan approval Admin/Aslab.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)}/>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- TAB NOTIFIKASI --- */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Pengaturan Notifikasi</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="enable_inventory_alerts" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Notifikasi Inventaris (Umum)</FormLabel><FormDescription>Aktifkan notifikasi terkait inventaris.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                  <FormField control={form.control} name="notify_low_stock" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Notifikasi Stok Rendah</FormLabel><FormDescription>Kirim notifikasi jika stok item hampir habis.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                  <FormField control={form.control} name="enable_maintenance_reminders" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Pengingat Maintenance Lab</FormLabel><FormDescription>Kirim pengingat untuk jadwal maintenance.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                  <FormField control={form.control} name="notify_student_due_reminders" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Pengingat Jatuh Tempo Mahasiswa</FormLabel><FormDescription>Kirim notifikasi ke mahasiswa jika peminjaman akan jatuh tempo.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* --- TAB PENGGUNA --- */}
            <TabsContent value="users" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Manajemen Akses Pengguna</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="user_registration_mode" render={({ field }) => (<FormItem><FormLabel>Mode Registrasi Pengguna</FormLabel><ShadSelect onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="open">Registrasi Terbuka</SelectItem><SelectItem value="approval">Perlu Approval Admin</SelectItem><SelectItem value="closed">Ditutup (Hanya Admin)</SelectItem></SelectContent></ShadSelect><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="max_borrowings_per_student" render={({ field }) => (<FormItem><FormLabel>Maks Peminjaman per Mahasiswa</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseInt(e.target.value) || null)} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="auto_suspend_overdue" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Suspend Otomatis Akun Overdue</FormLabel><FormDescription>Nonaktifkan sementara akun dengan peminjaman overdue.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* --- TAB LABORATORIUM --- */}
            <TabsContent value="labs" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Pengaturan Peminjaman Laboratorium</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="lab_booking_window_days" render={({ field }) => (<FormItem><FormLabel>Jendela Booking Lab (Hari Kedepan)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseInt(e.target.value) || null)} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="lab_max_booking_duration_hours" render={({ field }) => (<FormItem><FormLabel>Durasi Maks Booking Lab (Jam)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseInt(e.target.value) || null)} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="lab_allow_weekend_bookings" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Izinkan Booking Akhir Pekan</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                        <FormField control={form.control} name="lab_auto_approve_faculty_bookings" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Auto-Approve Booking Dosen/Staf</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                        <FormField control={form.control} name="lab_enforce_capacity_limits" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Paksakan Batas Kapasitas Lab</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )}/>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" disabled={isSaving || !form.formState.isDirty}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
            </Button>
            {form.formState.isDirty && !isSaving && (
                <Button type="button" variant="ghost" onClick={() => form.reset(settingsDataFromApi as SettingsFormData)} className="ml-2">
                    Batalkan Perubahan
                </Button>
            )}
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default SettingsPage;