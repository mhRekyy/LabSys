// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate mungkin tidak terpakai di sini
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import {
  ApiDashboardResponse,
  DashboardData,
  AdminAslabDashboardData,
  MahasiswaDashboardData,
  LabBookingItem, // Impor tipe baru
  ChartDataPoint,  // Impor tipe baru
} from '@/types/dashboard'; // Pastikan path ini benar

// --- UI Components (shadcn/ui atau library lain) ---
// Jika Anda tidak menggunakan shadcn/ui, Anda bisa mengganti ini dengan styling manual atau komponen UI lain
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users, Package, FlaskConical, CheckCircle, History, Layers3, PackageCheck,
  Clock, BookCheck, BarChart3, ListChecks, Plus, AlertTriangle // Tambahkan ikon baru jika perlu
} from "lucide-react";

// --- Recharts (jika menggunakan) ---
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ====================================================================================
// Komponen StatCard (Asumsi sudah ada dan benar dari kode Anda sebelumnya)
// ====================================================================================
const StatCard: React.FC<{ title: string; value: string | number | undefined; icon?: React.ReactNode; description?: string; linkTo?: string; linkText?: string }> = ({ title, value, icon, description, linkTo, linkText = "Lihat Detail" }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value === undefined || value === null ? '-' : value.toLocaleString()}</div>
                {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
                {linkTo && (<Button variant="link" asChild className="px-0 pt-2 text-xs h-auto text-primary"><Link to={linkTo}>{linkText}</Link></Button>)}
            </CardContent>
        </Card>
    </motion.div>
);

// ====================================================================================
// Komponen RecentLabBookingsTable (baru atau dari sebelumnya)
// ====================================================================================
const RecentLabBookingsTable: React.FC<{ bookings?: LabBookingItem[], title?: string, viewAllLink?: string }> = ({ bookings, title = "Riwayat Booking Laboratorium Terbaru", viewAllLink }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Tidak ada booking laboratorium untuk ditampilkan.</p></CardContent>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status: LabBookingItem['status']) => {
    // Sesuaikan variant badge berdasarkan status dari backend
    switch (status?.toLowerCase()) { // Tambahkan toLowerCase untuk konsistensi
      case 'pending': return 'secondary';
      case 'approved': return 'default'; // atau 'success' jika ada custom variant
      case 'rejected': return 'destructive';
      case 'completed': return 'outline'; // atau 'success'
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lab</TableHead>
              {bookings[0]?.user && <TableHead>Pemohon</TableHead> /* Tampilkan pemohon hanya jika ada (untuk admin) */}
              <TableHead>Waktu Mulai</TableHead>
              <TableHead>Waktu Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.lab?.name || booking.lab?.['nama_lab' as keyof typeof booking.lab] || `Lab ID: ${booking.lab_id}`}</TableCell>
                {booking.user && <TableCell>{booking.user?.name || `User ID: ${booking.user_id}`}</TableCell>}
                <TableCell>
                  {new Date(booking.start_time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </TableCell>
                 <TableCell>
                  {new Date(booking.end_time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                    {booking.status?.replace('_', ' ') || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="link" asChild size="sm" className="px-0 h-auto text-xs">
                    {/* Sesuaikan link detail booking jika ada halaman detail */}
                    <Link to={`/lab-bookings/${booking.id}`}>Detail</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {viewAllLink && bookings.length >= (bookings[0]?.user ? 5 : 3) && ( // Tampilkan jika ada link & jumlah item cukup
          <div className="mt-4 text-center">
            <Button variant="outline" asChild size="sm">
              <Link to={viewAllLink}>Lihat Semua</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ====================================================================================
// Komponen ActivityChart (baru atau dari sebelumnya)
// ====================================================================================
const ActivityChart: React.FC<{ data?: ChartDataPoint[]; title: string; lineColor?: string, dataKey?: string, name?: string }> = ({ data, title, lineColor = "#8884d8", dataKey = "total", name="Jumlah" }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
            <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Data tidak cukup untuk menampilkan chart.</p></CardContent>
      </Card>
    );
  }

  // Format tanggal untuk XAxis agar lebih rapi
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] md:h-[350px] p-2"> {/* Atur tinggi dan padding */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 25, left: -15, bottom: 5 }}> {/* Sesuaikan margin */}
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5}/>
            <XAxis dataKey="date" fontSize={11} tickMargin={5} />
            <YAxis allowDecimals={false} fontSize={11} tickMargin={5} />
            <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: '0.375rem', padding: '0.5rem 0.75rem' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '0.25rem' }}
                formatter={(value: number) => [value, name]}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={lineColor} strokeWidth={2} activeDot={{ r: 6 }} name={name} dot={{r:3}}/>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


// ====================================================================================
// Komponen Utama DashboardPage
// ====================================================================================
const DashboardPage: React.FC = () => {
  const { user, token, isAdmin, isAslab, isStudent } = useAuth();
  const canManage = isAdmin || isAslab;

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) { setIsLoading(false); setError("Sesi tidak valid atau token tidak ditemukan."); return; }
      setIsLoading(true); setError(null);
      try {
        // PENTING: Pastikan endpoint '/api/dashboard' sudah benar
        const response = await axiosInstance.get<ApiDashboardResponse>('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.data) {
          setDashboardData(response.data.data as DashboardData); // Cast ke DashboardData
        } else {
          throw new Error(response.data.message || "Gagal memuat data dashboard.");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err); // Log error detail ke konsol
        const errMsg = err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil data dashboard.";
        setError(errMsg); setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  // ----- RENDER STATES -----
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Memuat data dashboard...</p></div>;
  }
  if (error) {
    return <div className="p-4 md:p-6 text-center text-red-600 bg-red-100 border border-red-400 rounded-md">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-red-800">Error Memuat Dashboard</h3>
        <p className="text-xs text-red-700 mt-1">{error}</p>
        <p className="text-xs text-muted-foreground mt-2">Pastikan Anda terhubung ke internet dan server backend berjalan.</p>
    </div>;
  }
  if (!dashboardData) {
    return <div className="flex justify-center items-center h-screen"><p>Tidak ada data dashboard untuk ditampilkan.</p></div>;
  }

  // ----- RENDER CONTENT BASED ON ROLE -----
  const renderAdminAslabStats = () => {
    // Type guard untuk memastikan data adalah AdminAslabDashboardData
    if (!('totalUsers' in dashboardData)) return null; // Cek field unik untuk Admin/Aslab
    const data = dashboardData as AdminAslabDashboardData;

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Statistik yang sudah ada */}
          <StatCard title="Total Pengguna" value={data.totalUsers} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Jenis Inventaris" value={data.totalInventarisItems} icon={<Layers3 className="h-5 w-5" />} linkTo="/inventory" />
          <StatCard title="Unit Inventaris" value={data.totalInventarisUnits} icon={<Package className="h-5 w-5" />} linkTo="/inventory"/>
          <StatCard title="Total Laboratorium" value={data.totalLabs} icon={<FlaskConical className="h-5 w-5" />} linkTo="/laboratories" />
          <StatCard title="Lab Terbuka" value={data.labsOpen} icon={<CheckCircle className="h-5 w-5" />} description={`${data.totalLabs ? ((data.labsOpen || 0) / data.totalLabs * 100).toFixed(0) : '0'}% dari total`} linkTo="/laboratories?status=Open" />
          <StatCard title="Peminjaman Aktif" value={data.peminjamanAktifTotal} icon={<PackageCheck className="h-5 w-5" />} linkTo="/borrowing-history?status=Dipinjam" />
          <StatCard title="Menunggu Kembali (Overdue)" value={data.pendingReturnsTotal} icon={<History className="h-5 w-5" />} linkTo="/borrowing-history?status=Dipinjam&overdue=true" />
          {data.peminjamanMenungguPersetujuan !== undefined && (
            <StatCard title="Pinjam Tunggu Setuju" value={data.peminjamanMenungguPersetujuan} icon={<ListChecks className="h-5 w-5"/>} linkTo="/borrowing-history?status=Menunggu Persetujuan"/>
          )}

          {/* Statistik Booking Lab Baru untuk Admin/Aslab */}
          {data.labBookingsPendingApproval !== undefined && (
            <StatCard title="Booking Lab Pending" value={data.labBookingsPendingApproval} icon={<Clock className="h-5 w-5" />} linkTo="/lab-bookings?status=pending" />
          )}
          {data.labBookingsActiveToday !== undefined && (
            <StatCard title="Booking Lab Aktif Hari Ini" value={data.labBookingsActiveToday} icon={<BookCheck className="h-5 w-5" />} linkTo="/lab-bookings?status=active_today" />
          )}
        </div>

        {/* Chart dan Tabel Riwayat Booking untuk Admin/Aslab */}
        <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
          <ActivityChart data={data.peminjamanLast7Days} title="Aktivitas Peminjaman (7 Hari Terakhir)" lineColor="#3b82f6" name="Peminjaman"/>
          <ActivityChart data={data.labBookingsLast7Days} title="Aktivitas Booking Lab (7 Hari Terakhir)" lineColor="#10b981" name="Booking Lab"/>
        </div>

        <div className="mt-6">
          <RecentLabBookingsTable bookings={data.recentLabBookings} title="Booking Lab Terbaru (Semua User)" viewAllLink="/lab-bookings" />
        </div>
      </>
    );
  };

  const renderMahasiswaStats = () => {
    // Type guard untuk memastikan data adalah MahasiswaDashboardData
    if (!('activeBookings' in dashboardData)) return null; // Cek field unik untuk Mahasiswa
    const data = dashboardData as MahasiswaDashboardData;

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Statistik yang sudah ada */}
          <StatCard title="Peminjaman Alat Aktif Saya" value={data.activeBookings} icon={<PackageCheck className="h-5 w-5" />} linkTo="/my-borrowings?status=Dipinjam" />
          {data.myPeminjamanMenungguPersetujuan !== undefined && (
            <StatCard title="Pinjam Alat Tunggu Setuju" value={data.myPeminjamanMenungguPersetujuan} icon={<ListChecks className="h-5 w-5"/>} linkTo="/my-borrowings?status=Menunggu Persetujuan"/>
          )}
          <StatCard title="Cari Inventaris" value={" "} icon={<Package className="h-5 w-5" />} linkTo="/inventory" linkText="Lihat Inventaris"/>
          <StatCard title="Lihat Laboratorium" value={" "} icon={<FlaskConical className="h-5 w-5" />} linkTo="/laboratories" linkText="Lihat Lab"/>

          {/* Statistik Booking Lab Baru untuk Mahasiswa */}
          {data.myLabBookingsPending !== undefined && (
            <StatCard title="Booking Lab Pending Saya" value={data.myLabBookingsPending} icon={<Clock className="h-5 w-5" />} linkTo="/my-lab-bookings?status=pending" />
          )}
          {data.myLabBookingsApproved !== undefined && (
            <StatCard title="Booking Lab Disetujui Saya" value={data.myLabBookingsApproved} icon={<BookCheck className="h-5 w-5" />} linkTo="/my-lab-bookings?status=approved" />
          )}
        </div>

        {/* Chart dan Tabel Riwayat Booking untuk Mahasiswa */}
        <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
          <ActivityChart data={data.myPeminjamanLast7Days} title="Aktivitas Pinjam Alat Saya (7 Hari)" lineColor="#82ca9d" name="Peminjaman Saya"/>
          <ActivityChart data={data.myLabBookingsLast7Days} title="Aktivitas Booking Lab Saya (7 Hari)" lineColor="#ffc658" name="Booking Saya"/>
        </div>
        <div className="mt-6">
          <RecentLabBookingsTable bookings={data.myRecentLabBookings} title="Booking Lab Terbaru Saya" viewAllLink="/my-lab-bookings"/>
        </div>
      </>
    );
  };

  // ----- RETURN JSX UTAMA -----
  return (
    <motion.div
      className="animate-fade-in space-y-6 p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-y-2 sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang kembali, {user?.name || 'Pengguna'}!</p>
        </div>
        {isStudent && <Button asChild size="sm"><Link to="/inventory"><Package className="mr-2 h-4 w-4"/>Pinjam Alat</Link></Button>}
        {canManage && <Button asChild size="sm"><Link to="/inventory/add"><Plus className="mr-2 h-4 w-4"/>Tambah Inventaris</Link></Button>}
      </div>

      {/* Pilih render function berdasarkan role dari useAuth */}
      {isAdmin && renderAdminAslabStats()}
      {isAslab && !isAdmin && renderAdminAslabStats()} {/* Aslab juga melihat statistik Admin/Aslab */}
      {isStudent && renderMahasiswaStats()}

      {/* Fallback jika role tidak cocok atau data spesifik role tidak ada */}
      {!isAdmin && !isAslab && !isStudent && (
        <p className="text-muted-foreground">Tidak ada tampilan dashboard spesifik untuk role Anda saat ini.</p>
      )}
    </motion.div>
  );
};

export default DashboardPage;