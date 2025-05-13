<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => class_basename($this->type), // Nama class notifikasi (misal: EquipmentDueSoon)
            'data' => $this->data, // Data notifikasi (biasanya array/JSON)
            'read_at' => $this->read_at ? $this->read_at->toIso8601String() : null,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}