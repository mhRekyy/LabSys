// src/components/laboratories/BookingForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Laboratorium } from "./types";

// Definisikan tipe data yang AKAN DIKIRIM oleh form ini KE PARENT (LabBookingDialog)
// Tanggal akan sudah diformat sebagai string.
export interface FormattedBookingPayload {
  inventaris_id: number; // Diubah menjadi number
  jumlah_pinjam: number;
  tanggal_pinjam: string; // YYYY-MM-DD
  tanggal_kembali_rencana: string; // YYYY-MM-DD
  tujuan_peminjaman: string;
}

// Tipe data internal untuk form (sebelum tanggal diformat)
interface InternalBookingFormData {
    inventaris_id: string; // Dari select masih string
    jumlah_pinjam: number;
    tanggal_pinjam: Date;
    tanggal_kembali_rencana: Date;
    tujuan_peminjaman: string;
}

// Skema validasi menggunakan Zod (untuk tipe internal form)
const bookingFormSchema = z.object({
  inventaris_id: z.string().min(1, { message: "Silakan pilih alat." }), // Validasi sebagai string dulu
  jumlah_pinjam: z.coerce.number().min(1, { message: "Jumlah pinjam minimal 1." }),
  tanggal_pinjam: z.date({ required_error: "Tanggal pinjam harus diisi." }),
  tanggal_kembali_rencana: z.date({ required_error: "Tanggal kembali harus diisi." }), // Validasi tanggal kembali > tanggal pinjam akan ada di handleSubmitForm
  tujuan_peminjaman: z.string().min(5, { message: "Tujuan peminjaman minimal 5 karakter." }).max(255, { message: "Tujuan maksimal 255 karakter."}),
});

interface BookingFormProps {
  lab: Laboratorium;
  onSubmit: (data: FormattedBookingPayload) => void; // onSubmit sekarang menerima payload yang sudah diformat
}

interface InventarisItem {
  id: number;
  nama_alat: string;
  stok_tersedia: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ lab, onSubmit }) => {
  const [inventarisList, setInventarisList] = useState<InventarisItem[]>([]);
  const [isLoadingInventaris, setIsLoadingInventaris] = useState(false);

  useEffect(() => {
    // TODO: Ganti dengan API call sebenarnya untuk fetch inventaris by lab.id atau lab.lokasi_...
    setIsLoadingInventaris(true);
    setTimeout(() => { // Simulasi API
      setInventarisList([
        { id: 101, nama_alat: `Osiloskop (dari ${lab.nama_lab})`, stok_tersedia: 3 },
        { id: 102, nama_alat: `Generator Sinyal (dari ${lab.nama_lab})`, stok_tersedia: 2 },
        { id: 103, nama_alat: `Multimeter (dari ${lab.nama_lab})`, stok_tersedia: 5 },
      ]);
      setIsLoadingInventaris(false);
    }, 500);
  }, [lab.id, lab.nama_lab]);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      inventaris_id: "",
      jumlah_pinjam: 1,
      tanggal_pinjam: new Date(),
      tanggal_kembali_rencana: addDays(new Date(), 1),
      tujuan_peminjaman: "",
    },
  });

  const selectedInventarisId_string = form.watch("inventaris_id");
  const selectedInventaris = inventarisList.find(inv => inv.id.toString() === selectedInventarisId_string);

  const handleSubmitForm = (data: z.infer<typeof bookingFormSchema>) => { // data di sini adalah InternalBookingFormData
    if (data.tanggal_kembali_rencana <= data.tanggal_pinjam) {
      form.setError("tanggal_kembali_rencana", { type: "manual", message: "Tanggal kembali harus setelah tanggal pinjam." });
      return;
    }
    if (selectedInventaris && data.jumlah_pinjam > selectedInventaris.stok_tersedia) {
      form.setError("jumlah_pinjam", { type: "manual", message: `Stok ${selectedInventaris.nama_alat} hanya ${selectedInventaris.stok_tersedia}.`});
      return;
    }

    const payload: FormattedBookingPayload = {
      inventaris_id: parseInt(data.inventaris_id, 10), // Konversi ke number di sini
      jumlah_pinjam: data.jumlah_pinjam,
      tanggal_pinjam: format(data.tanggal_pinjam, "yyyy-MM-dd"),
      tanggal_kembali_rencana: format(data.tanggal_kembali_rencana, "yyyy-MM-dd"),
      tujuan_peminjaman: data.tujuan_peminjaman,
    };
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="inventaris_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alat yang Dipinjam</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingInventaris}>
                <FormControl><SelectTrigger><SelectValue placeholder={isLoadingInventaris ? "Memuat alat..." : "Pilih alat"} /></SelectTrigger></FormControl>
                <SelectContent>
                  {!isLoadingInventaris && inventarisList.length === 0 && <SelectItem value="-" disabled>Tidak ada alat.</SelectItem>}
                  {inventarisList.map((item) => ( <SelectItem key={item.id} value={item.id.toString()}>{item.nama_alat} (Stok: {item.stok_tersedia})</SelectItem>))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jumlah_pinjam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Pinjam</FormLabel>
              <FormControl><Input type="number" placeholder="Jumlah" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} /></FormControl>
              {selectedInventaris && <FormDescription className="text-xs">Stok: {selectedInventaris.stok_tersedia}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tanggal_pinjam"
          render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Tanggal Pinjam</FormLabel>
              <Popover><PopoverTrigger asChild><FormControl>
                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                  {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button></FormControl></PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || date > addDays(new Date(), 30)} initialFocus/>
                </PopoverContent>
              </Popover><FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tanggal_kembali_rencana"
          render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Tanggal Kembali Rencana</FormLabel>
              <Popover><PopoverTrigger asChild><FormControl>
                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                  {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button></FormControl></PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={(date) => {
                      field.onChange(date);
                      const tglPinjam = form.getValues("tanggal_pinjam");
                      if (date && tglPinjam && date <= tglPinjam) form.setError("tanggal_kembali_rencana", { message: "Harus setelah tgl pinjam."});
                      else form.clearErrors("tanggal_kembali_rencana");
                    }}
                    disabled={(date) => date < (form.getValues("tanggal_pinjam") || new Date(new Date().setHours(0,0,0,0))) || date > addDays(new Date(), 60)} initialFocus/>
                </PopoverContent>
              </Popover><FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tujuan_peminjaman"
          render={({ field }) => (
            <FormItem><FormLabel>Tujuan Peminjaman</FormLabel>
              <FormControl><Textarea placeholder="Jelaskan tujuan peminjaman..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting || isLoadingInventaris}>
            {form.formState.isSubmitting ? "Mengajukan..." : "Ajukan Peminjaman"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BookingForm;