<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
    /**
     * LocationController constructor.
     * Applies admin authentication middleware.
     */
    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    /**
     * Display a listing of locations.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Get locations ordered by creation date, paginated
        $locations = Location::orderBy('created_at', 'desc')->paginate(10);
        return view('admin.dashboard', compact('locations'));
    }

    /**
     * Store a newly created location in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'image'     => 'nullable|image|max:2048', // allow up to 2 MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Store under storage/app/public/locations
            $imagePath = $request->file('image')->store('locations', 'public');
        }

        Location::create([
            'name'        => $request->name,
            'description' => $request->description,
            'latitude'    => $request->latitude,
            'longitude'   => $request->longitude,
            'image_path'  => $imagePath,
        ]);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Location added successfully.');
    }

    /**
     * Remove the specified location from storage.
     * Uses route model binding for cleaner code.
     *
     * @param  \App\Models\Location  $location
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Location $location)
    {
        // If it had an image, delete it
        if ($location->image_path) {
            Storage::disk('public')->delete($location->image_path);
        }
        $location->delete();

        return back()->with('success', 'Location deleted.');
    }

    /**
     * Show the form for editing the specified location.
     * (Suggested new feature)
     *
     * @param  \App\Models\Location  $location
     * @return \Illuminate\View\View
     */
    public function edit(Location $location)
    {
        return view('admin.edit_location', compact('location'));
    }

    /**
     * Update the specified location in storage.
     * (Suggested new feature)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Location  $location
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Location $location)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'image'     => 'nullable|image|max:2048',
        ]);

        $imagePath = $location->image_path;
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('locations', 'public');
        }

        $location->update([
            'name'        => $request->name,
            'description' => $request->description,
            'latitude'    => $request->latitude,
            'longitude'   => $request->longitude,
            'image_path'  => $imagePath,
        ]);

        return redirect()->route('admin.locations.index')
            ->with('success', 'Location updated successfully.');
    }
}
