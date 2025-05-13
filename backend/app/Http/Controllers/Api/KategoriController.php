<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kategori;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        {
            try {
                // Ambil semua data kategori dari database
                $kategoris = Kategori::orderBy('nama_kategori')->get(); // Urutkan berdasarkan nama
    
                // Kembalikan response JSON sukses dengan data kategori
                return response()->json([
                    'success' => true,
                    'message' => 'Daftar kategori berhasil diambil',
                    'data' => $kategoris
                ], 200);
    
            } catch (\Exception $e) {
                // Tangani jika terjadi error saat mengambil data
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengambil data kategori: ' . $e->getMessage()
                ], 500); // Internal Server Error
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
