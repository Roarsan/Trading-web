export default function WatchlistPage() {
    return (
      <main className="p-6 space-y-8">
        <h1 className="text-2xl font-bold">Watchlist</h1>
  
        {/* Stock Input */}
        <section className="space-y-4">
          <input 
            type="text" 
            placeholder="Enter stock symbol..." 
            className="border p-2 rounded w-full max-w-sm"
          />
          <button className="p-2 px-4 bg-blue-600 text-white rounded">Add</button>
        </section>
  
        {/* List of watched stocks */}
        <section className="space-y-3">
          <div className="p-3 border rounded">No stocks added yet.</div>
        </section>
      </main>
    );
  }
  