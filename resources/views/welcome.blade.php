@extends('layouts.app')

@section('title', 'Quench Quest by Bore Street Bistro')

@section('content')
    <div class="container py-5">
        <!-- Hero Section -->
        <section class="hero-section text-center mb-5 position-relative">
            <img src="https://borestreet.cafe/logo.png" alt="Bore Street Bistro logo">
            <h1 class="display-4 text-primary mb-2 hero-title">Thirsty Thursday Quench Quest</h1>
            <div class="brand-gradient mb-3"></div>
            <p class="lead mb-4">Be one of the <span style="color:#ff3b3f;font-weight:bold;">first 3</span> to check in
                to this week’s interesting location,
                and win a prize!<br>
                <span class="prize-desc">🥇 First Checkin: <b>Get a free drink from our menu including; Smoothies, Milkshakes & Iced Coffees</b><br>
                🥈🥉 Second & Third: <b>Get a free hot drink or soft drink of your choice</b></span>
            </p>
            <div class="how-it-works mx-auto mb-4 how-it-works-container">
                <div class="row text-center">
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <div class="step-icon mb-2">📍</div>
                        <div class="step-title">Find the Spot</div>
                        <div class="step-desc text-muted">Check the map for this week’s secret location.</div>
                    </div>
                    <div class="col-12 col-md-4 mb-3 mb-md-0">
                        <div class="step-icon mb-2">🚶‍♂️</div>
                        <div class="step-title">Go &amp; Check In</div>
                        <div class="step-desc text-muted">Visit in person, get within 50m, and tap Check In.</div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="step-icon mb-2">🥤</div>
                        <div class="step-title">Win a Drink!</div>
                        <div class="step-desc text-muted">If you’re one of the first 3, you win a prize!</div>
                    </div>
                </div>
            </div>
        </section>

        @php
            // Get the single current location (newest)
            $current = \App\Models\Location::orderBy('created_at','desc')->first();
        @endphp

        @if ($current)
            <section class="card mb-4 shadow-sm location-card p-3">
                <div class="row">
                    <div class="col-md-3">
                        @if ($current->image_path)
                            <div class="mb-3 text-center">
                                <img
                                    src="{{ asset('storage/' . $current->image_path) }}"
                                    alt="{{ $current->name }}"
                                    class="img-fluid rounded shadow img-location"
                                    loading="lazy"
                                />
                            </div>
                        @endif
                        <h3 id="location-name" class="mb-1">{{ $current->name }}</h3>
                        <p id="location-desc" class="mb-2">{{ $current->description }}</p>
                        <small id="location-date" class="text-muted">Posted
                            on {{ $current->created_at->format('d M Y') }}</small>

                        <div class="text-center mt-6">
                            <button id="check-in" class="btn btn-success btn-lg px-5 py-2">
                                Check
                                In
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="map-section mb-5" style="padding: 0 !important;">
                            <div class="map-loading-spinner" id="map-loading-spinner"
                                 style="display:none;text-align:center;padding:2em;">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading map...</span>
                                </div>
                            </div>
                            <div id="map"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        @php
                            // Fetch top 10 winners for leaderboard
                            $leaderboard = \App\Models\Winner::selectRaw('name, COUNT(*) as wins')
                                             ->groupBy('name')
                                             ->orderByDesc('wins')
                                             ->limit(10)
                                             ->get();
                        @endphp

                        {{-- Leaderboard Section --}}
                        <section class="leaderboard mb-5">
                            <h2 class="h5 text-secondary text-center mb-3">🏆
                                Leaderboard</h2>
                            @if ($leaderboard->isEmpty())
                                <p class="text-center">No winners yet.</p>
                            @else
                                <div class="card p-3 mx-auto leaderboard-card">
                                    <ul class="list-group list-group-flush">
                                        @foreach ($leaderboard as $i => $entry)
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                    @if($i==0)
                                        <span class="leaderboard-rank rank-1">🥇</span>
                                    @elseif($i==1)
                                        <span class="leaderboard-rank rank-2">🥈</span>
                                    @elseif($i==2)
                                        <span class="leaderboard-rank rank-3">🥉</span>
                                    @else
                                        <span class="leaderboard-rank rank-other">#{{ $i+1 }}</span>
                                    @endif
                                    <span class="leaderboard-name">{{ $entry->name }}</span>
                                </span>
                                                <span class="badge bg-primary rounded-pill">{{ $entry->wins }}</span>
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                        </section>
                    </div>

                </div>

            </section>

            <!-- Check-In Modal -->
            <div class="modal fade" id="checkinModal" tabindex="-1" aria-labelledby="checkinModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="checkinModalLabel">Check In</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="checkin-form">
                                <input type="hidden" name="location_id" value="{{ $current->id }}">
                                <div class="mb-3">
                                    <label for="checkin-name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="checkin-name" name="name" required
                                           maxlength="255">
                                </div>
                                <div class="mb-3">
                                    <label for="checkin-email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="checkin-email" name="email"
                                           required maxlength="255">
                                </div>
                                <div class="mb-3">
                                    <label for="checkin-social" class="form-label">Social Tag (optional)</label>
                                    <input type="text" class="form-control" id="checkin-social" name="social_tag"
                                           maxlength="255">
                                </div>
                                <div id="checkin-error" class="alert alert-danger d-none"></div>
                                <button type="submit" class="btn btn-primary w-100" id="checkin-submit-btn">
                                    <span id="checkin-submit-text">Submit</span>
                                    <span id="checkin-submit-spinner" class="spinner-border spinner-border-sm d-none"
                                          role="status" aria-hidden="true"></span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        @else
            <p class="text-center">No location posted this week yet.</p>
        @endif



        @php
            // Locations JSON (filtered by 1.5mi) is fetched in JS, so we just need the map container
        @endphp



        {{-- Extra Feature Idea: “Share This Page” --}}
        <section class="share-section text-center mb-5">
            <div class="mb-2 share-title">Enjoying the Hunt?</div>
            <a class="btn share-btn mx-2"
               href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(request()->fullUrl()) }}"
               target="_blank">Share on Facebook</a>
            <a class="btn share-btn mx-2"
               href="https://twitter.com/intent/tweet?url={{ urlencode(request()->fullUrl()) }}&text=Join+the+Bore+Street+Hunt!"
               target="_blank">Tweet</a>
        </section>
    </div>
@endsection

@section('afterBody')
    @include('partials.footer')
    <link rel="stylesheet" href="{{ mix('css/main.css') }}">
    <script src="{{ mix('js/app.js') }}" defer></script>
@endsection
