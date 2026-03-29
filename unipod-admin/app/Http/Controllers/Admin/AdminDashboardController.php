<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $tables = [
            'categories',
            'tags',
            'mentors',
            'startups',
            'startup_members',
            'programs',
            'program_startup',
            'courses',
            'course_modules',
            'lessons',
            'venues',
            'events',
            'event_registrations',
            'tickets',
            'payments',
            'invoices',
            'notifications',
            'messages',
            'resources',
            'audits',
        ];

        $stats = [];
        foreach ($tables as $table) {
            $stats[$table] = DB::table($table)->count();
        }

        return view('admin.dashboard', [
            'stats' => $stats,
            'tableCount' => count($tables),
        ]);
    }
}
