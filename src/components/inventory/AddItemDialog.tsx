// src/components/inventory/AddItemDialog.tsx (REVISI LENGKAP)

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // Tambahkan jika perlu
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// Hapus import Category, Location dari types/inventory jika tipe lama
// import { Category, Location } from "@/types/inventory";
import { toast } from "sonner"; // Jika ingin toast di sini (opsional)

// --- Tipe Data Kategori dari Backend ---
// Idealnya impor dari file tipe bersama
interface KategoriType {
    id: number;
    nama_kategori: string;
}
// Tipe Data Lokasi (Sementara - Sesuaikan jika dari API)
interface Location {
    id: string;
    name: string;
    building: string;
}
// --- Akhir Tipe Data ---


// --- Skema Validasi Zod (Sesuaikan dengan backend) ---
// Pastikan nama field (name, description, dll.) sesuai dengan input form
// dan bisa dipetakan ke field backend (nama_alat, deskripsi, dll.)
const formSchema = z.object({
  name: z.string().min(2, { message: "Nama Alat minimal 2 karakter" }),
  description: z.string().optional(), // Buat opsional jika di backend nullable
  categoryId: z.string({ required_error: "Pilih kategori" }), // ID kategori (string dari select)
  // locationId: z.string({ required_error: "Pilih lokasi" }), // Jika lokasi dipilih berdasarkan ID
  location: z.string().optional(), // Ubah ke string jika input manual atau backend terima string nama lokasi
  quantity: z.coerce.number().int().min(0, { message: "Jumlah tidak boleh negatif" }), // Izinkan 0 jika perlu
  // Sesuaikan enum kondisi dengan backend ('Baik', 'Rusak Ringan', ...)
  condition: z.enum(["Baik", "Rusak Ringan", "Rusak Berat", "Dalam Perbaikan"], { required_error: "Pilih kondisi"}),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(), // Input tanggal biasanya string 'YYYY-MM-DD'
  // Hapus field yang tidak ada di backend API (model, manufacturer, notes, imageUrl)
  // model: z.string().optional(),
  // manufacturer: z.string().optional(),
  // notes: z.string().optional(),
  // imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Tipe Data untuk onAddItem (Sesuai yang dibutuhkan API Backend) ---
interface NewItemDataForApi {
    nama_alat: string;
    deskripsi?: string | null; // Gunakan tipe optional/nullable jika sesuai
    kategori_id: number | null; // ID Kategori
    lokasi?: string | null;
    jumlah: number;
    kondisi: string;
    nomor_seri?: string | null;
    tanggal_pengadaan?: string | null; // Format YYYY-MM-DD
     // Tambahkan field lain jika backend butuh
}


// --- Definisi Props ---
interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Gunakan tipe data yang benar untuk onAddItem
  onAddItem: (newItemData: NewItemDataForApi) => Promise<void> | void; // Bisa async jika parent async
  categories: KategoriType[]; // Gunakan tipe KategoriType
  locations?: Location[]; // Jadikan opsional jika belum ada data lokasi
}


const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onOpenChange,
  onAddItem,
  categories,
  // locations = [], // Default ke array kosong jika opsional
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
      condition: "Baik", // Default backend "Baik"
      serialNumber: "",
      location: "", // Default lokasi kosong
      purchaseDate: "",
      // categoryId: "", // Biarkan kosong agar placeholder muncul
      // Hapus default value untuk field yg tidak ada di skema baru
      // model: "",
      // manufacturer: "",
      // notes: "",
      // imageUrl: "",
    },
  });

  // --- Fungsi onSubmit yang Baru ---
  const onSubmit = (data: FormValues) => {
    // Siapkan data sesuai format yang dibutuhkan API Backend
    const newItemDataForApi: NewItemDataForApi = {
      nama_alat: data.name,
      deskripsi: data.description || null,
      // Konversi categoryId (string) ke number, atau biarkan string jika backend handle
      kategori_id: data.categoryId ? parseInt(data.categoryId) : null,
      // Kirim nama lokasi (string) atau ID jika perlu
      lokasi: data.location || null, // Asumsi backend terima nama lokasi string
      jumlah: data.quantity,
      kondisi: data.condition,
      nomor_seri: data.serialNumber || null,
      tanggal_pengadaan: data.purchaseDate || null, // Pastikan format YYYY-MM-DD
    };

    console.log("Data to be sent to onAddItem:", newItemDataForApi); // Untuk Debug

    // Panggil fungsi onAddItem dari parent (Inventory.tsx)
    // Fungsi di parent akan memanggil API backend
    try {
         onAddItem(newItemDataForApi); // Panggil fungsi dari props
         // Biarkan parent (Inventory.tsx) yang handle toast & reset/close
         // form.reset(); // Reset bisa dilakukan di parent jika API sukses
         // onOpenChange(false);
    } catch (error) {
        console.error("Error occurred when calling onAddItem:", error);
        // Toast error bisa ditampilkan di sini atau di parent
        toast.error("Failed to initiate adding item.");
    }
  };
  // --- Akhir Fungsi onSubmit ---


  // --- JSX ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          {/* <DialogDescription>Fill in the details below.</DialogDescription> */}
        </DialogHeader>

        <Form {...form}>
          {/* Pastikan form memanggil onSubmit */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 pr-2"> {/* Tambah pr-2 untuk scrollbar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Name (nama_alat) */}
              <FormField
                control={form.control}
                name="name" // Sesuai skema Zod
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity (jumlah) */}
              <FormField
                control={form.control}
                name="quantity" // Sesuai skema Zod
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity*</FormLabel>
                    <FormControl>
                       {/* Ubah onChange sedikit untuk memastikan nilai adalah number */}
                       <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={event => field.onChange(parseInt(event.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category (kategori_id) */}
              <FormField
                control={form.control}
                name="categoryId" // Sesuai skema Zod (ID kategori)
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    {/* Gunakan KategoriType */}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Gunakan properti dari KategoriType */}
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.nama_kategori} {/* <<< Ganti nama properti */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Location (lokasi) - Input Teks Biasa */}
              <FormField
                control={form.control}
                name="location" // Field untuk nama lokasi (string)
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Condition (kondisi) */}
              <FormField
                control={form.control}
                name="condition" // Sesuai skema Zod
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition*</FormLabel>
                    {/* Pastikan value sesuai enum backend ('Baik', dll) */}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Baik">Baik</SelectItem>
                        <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                        <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                        <SelectItem value="Dalam Perbaikan">Dalam Perbaikan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Serial Number (nomor_seri) */}
              <FormField
                control={form.control}
                name="serialNumber" // Sesuai skema Zod
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Serial number (if any)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Purchase Date (tanggal_pengadaan) */}
               <FormField
                control={form.control}
                name="purchaseDate" // Sesuai skema Zod
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hapus field Model, Manufacturer, Image URL, Notes jika tidak dikirim ke backend */}

            </div> {/* Akhir Grid */}

            {/* Description (deskripsi) */}
            <FormField
              control={form.control}
              name="description" // Sesuai skema Zod
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the item (optional)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { form.reset(); onOpenChange(false); }}>
                Cancel
              </Button>
              {/* Tombol submit sekarang memanggil onSubmit internal */}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;