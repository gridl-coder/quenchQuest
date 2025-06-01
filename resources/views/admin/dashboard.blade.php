@extends('layouts.app')

@section('title', 'Admin Dashboard')

@section('content')
    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Admin Dashboard</h1>
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="btn btn-outline-danger">Logout</button>
            </form>
        </div>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <h2 class="h5 text-secondary mb-3">Add New Location</h2>
        <form method="POST" action="{{ route('admin.locations.store') }}" enctype="multipart/form-data">
            @csrf
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                    type="text"
                    class="form-control"
                    name="name"
                    required
                    value="{{ old('name') }}">
            </div>
            <div class="mb-3">
                <label class="form-label">Description (optional)</label>
                <textarea
                    class="form-control"
                    name="description"
                    rows="2">{{ old('description') }}</textarea>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Latitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        class="form-control"
                        name="latitude"
                        required
                        value="{{ old('latitude') }}">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Longitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        class="form-control"
                        name="longitude"
                        required
                        value="{{ old('longitude') }}">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Image (optional)</label>
                    <input
                        class="form-control"
                        type="file"
                        name="image"
                        accept="image/*">
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Add Location</button>
        </form>

        <hr>

        <h2 class="h5 text-secondary mt-4 mb-3">All Locations</h2>
        @php
            $locationsPaginated = $locations; // passed from controller
        @endphp
        <table class="table table-striped align-middle">
            <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Posted At</th>
                <th>Coords</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            @foreach ($locationsPaginated as $loc)
                <tr>
                    <td>
                        @if ($loc->image_path)
                            <img
                                src="{{ asset('storage/' . $loc->image_path) }}"
                                alt="Thumb"
                                style="height: 50px; border-radius: 4px;"
                            />
                        @else
                            <span class="text-muted">—</span>
                        @endif
                    </td>
                    <td>{{ $loc->name }}</td>
                    <td>{{ $loc->created_at->format('d M Y') }}</td>
                    <td>{{ $loc->latitude }}, {{ $loc->longitude }}</td>
                    <td>
                        <form method="POST" action="{{ route('admin.locations.destroy', $loc->id) }}"
                              onsubmit="return confirm('Delete this location?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
        {{ $locationsPaginated->links() }}
    </div>
@endsection

@section('afterBody')
    @include('partials.footer')
@endsection
