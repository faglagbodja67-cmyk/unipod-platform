<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Admin Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <p class="text-lg font-semibold">Espace administrateur UNIPOD</p>
                    <p class="mt-2 text-sm text-gray-600">
                        Tables metier configurees: {{ $tableCount }}.
                    </p>
                    <p class="mt-1 text-sm text-gray-600">
                        Compte admin seed: <strong>admin@unipod.local</strong> / <strong>password</strong>.
                    </p>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Statistiques des tables</h3>
                    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        @foreach ($stats as $table => $count)
                            <div class="border border-gray-200 rounded-lg p-4">
                                <p class="text-xs uppercase tracking-wide text-gray-500">{{ $table }}</p>
                                <p class="text-2xl font-bold text-gray-900 mt-1">{{ $count }}</p>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
