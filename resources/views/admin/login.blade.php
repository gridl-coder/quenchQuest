@extends('layouts.app')

@section('title', 'Admin Login')

@section('content')
    <div class="container py-5">
        <h1 class="mb-4">Admin Login</h1>
        @if ($errors->any())
            <div class="alert alert-danger">
                {{ $errors->first() }}
            </div>
        @endif
        <form method="POST" action="{{ route('admin.login') }}">
            @csrf
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    required
                    value="{{ old('email') }}">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </div>
@endsection

@section('afterBody')
    @include('partials.footer')
@endsection
