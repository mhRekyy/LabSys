// src/components/laboratories/LabFilters.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Asumsi untuk type checkboxes
import { Label } from "@/components/ui/label"; // Asumsi untuk checkbox
import { Button } from "@/components/ui/button"; // Untuk FilterToggleButton
import { SlidersHorizontal } from "lucide-react"; // Icon untuk toggle
import { useLabFilters } from "./LabFilteringProvider";
import { FrontendLaboratoriumFilters } from "./types"; // Import tipe filter
import { motion } from "framer-motion"; // Jika masih dipakai

// Anda mungkin perlu membuat ulang komponen filter spesifik (SearchFilter, BuildingFilter, dll.)
// atau implementasikan langsung di sini. Untuk contoh, saya implementasikan langsung.

const LabFilters: React.FC = () => {
  const {
    backendFilters,
    setBackendFilters,
    frontendFilters,
    setFrontendFilters,
    filterOptions,
  } = useLabFilters();

  // State lokal untuk show/hide advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackendFilters((prev) => ({ ...prev, search: event.target.value }));
  };

  // Untuk dropdown status utama (yang ke API)
  // const handleApiStatusChange = (value: string) => {
  //   setBackendFilters((prev) => ({ ...prev, status: value as BackendLaboratoriumFilters['status'] }));
  // };

  // Untuk filter frontend
  const handleBuildingChange = (value: string) => {
    setFrontendFilters((prev) => ({ ...prev, building: value }));
  };

  const handleFloorChange = (value: string) => {
    setFrontendFilters((prev) => ({ ...prev, floor: value }));
  };

  const handleTypeDropdownChange = (value: string) => {
    setFrontendFilters((prev) => ({ ...prev, typeDropdown: value }));
  };

  const handleTypeCheckboxChange = (typeName: string) => {
    setFrontendFilters((prev) => ({
      ...prev,
      selectedTypeCheckboxes: {
        ...prev.selectedTypeCheckboxes,
        [typeName.toLowerCase()]: !prev.selectedTypeCheckboxes[typeName.toLowerCase()],
      },
    }));
  };

  // Status checkboxes UI (Open/Closed) - ini akan mengontrol backendFilters.status
  // Ini agak tricky jika kita punya dropdown status utama DAN checkbox status.
  // Biasanya salah satu saja. Jika ingin keduanya, perlu sinkronisasi.
  // Untuk saat ini, saya asumsikan status utama dikontrol oleh Tabs di LaboratoriesContent.
  // Jadi, StatusFilter (checkbox Open/Closed) mungkin tidak diperlukan di sini jika Tabs sudah ada.

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center p-4 border rounded-lg shadow-sm bg-card">
        <Input
          type="text"
          placeholder="Cari nama lab, deskripsi..."
          value={backendFilters.search}
          onChange={handleSearchChange}
          className="flex-grow"
        />
        <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="w-full sm:w-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter Lanjutan {showAdvancedFilters ? '(Sembunyikan)' : '(Tampilkan)'}
        </Button>
      </div>

      {showAdvancedFilters && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 border rounded-lg shadow-sm bg-card"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Building Filter */}
          <div>
            <Label htmlFor="building-filter" className="text-sm font-medium">Gedung</Label>
            <Select value={frontendFilters.building} onValueChange={handleBuildingChange}>
              <SelectTrigger id="building-filter"><SelectValue placeholder="Semua Gedung" /></SelectTrigger>
              <SelectContent>
                {filterOptions.buildings.map(b => <SelectItem key={b} value={b}>{b === "all" ? "Semua Gedung" : b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Floor Filter */}
          <div>
            <Label htmlFor="floor-filter" className="text-sm font-medium">Lantai</Label>
            <Select value={frontendFilters.floor} onValueChange={handleFloorChange}>
              <SelectTrigger id="floor-filter"><SelectValue placeholder="Semua Lantai" /></SelectTrigger>
              <SelectContent>
                {filterOptions.floors.map(f => <SelectItem key={f} value={f}>{f === "all" ? "Semua Lantai" : `Lantai ${f}`}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Type Dropdown Filter */}
          <div>
            <Label htmlFor="type-dropdown-filter" className="text-sm font-medium">Tipe (Dropdown)</Label>
            <Select value={frontendFilters.typeDropdown} onValueChange={handleTypeDropdownChange}>
              <SelectTrigger id="type-dropdown-filter"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
              <SelectContent>
                {filterOptions.types.map(t => <SelectItem key={t} value={t}>{t === "all" ? "Semua Tipe" : t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Type Checkboxes Filter */}
          {filterOptions.types.length > 1 && filterOptions.types[0] === "all" && ( // Hanya tampilkan jika ada tipe selain "all"
            <div className="sm:col-span-2 lg:col-span-3 mt-2">
              <Label className="text-sm font-medium mb-2 block">Tipe (Checkboxes)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                {filterOptions.types.slice(1).map((type) => ( // Skip "all"
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.toLowerCase()}`}
                      checked={frontendFilters.selectedTypeCheckboxes[type.toLowerCase()] || false}
                      onCheckedChange={() => handleTypeCheckboxChange(type)}
                    />
                    <Label htmlFor={`type-${type.toLowerCase()}`} className="font-normal">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LabFilters;