<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            ['key' => 'institution_name', 'value' => 'Fakultas MIPA Universitas Contoh', 'type' => 'string'],
            ['key' => 'admin_contact_email', 'value' => 'admin@mipa.contoh.ac.id', 'type' => 'string'],
            ['key' => 'enable_inventory_alerts', 'value' => '1', 'type' => 'boolean'], // 1 for true
            ['key' => 'enable_maintenance_reminders', 'value' => '0', 'type' => 'boolean'], // 0 for false

            // System Preferences
            ['key' => 'default_inventory_view', 'value' => 'Grid', 'type' => 'string'],
            ['key' => 'items_per_page', 'value' => '12', 'type' => 'integer'],
            ['key' => 'confirm_before_deleting', 'value' => '1', 'type' => 'boolean'],

            // User Management
            ['key' => 'require_admin_approval', 'value' => '0', 'type' => 'boolean'],
            ['key' => 'max_borrowings_per_student', 'value' => '5', 'type' => 'integer'],
            ['key' => 'auto_suspend_overdue', 'value' => '0', 'type' => 'boolean'],

            // Laboratory Management
            ['key' => 'lab_booking_window_days', 'value' => '14', 'type' => 'integer'],
            ['key' => 'lab_max_booking_duration_hours', 'value' => '4', 'type' => 'integer'],
            ['key' => 'lab_allow_weekend_bookings', 'value' => '0', 'type' => 'boolean'],

            // Notification Settings (Contoh)
            ['key' => 'notify_inventory_updates', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'notify_low_stock', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'notify_student_due_reminders', 'value' => '1', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        $this->command->info('Data settings default berhasil di-seed.');
    }
}