export default function WatchlistPage() {
    return (
      <main className="page">
        <div className="container-xl">
          <h1 className="page-title">Watchlist</h1>
    
          {/* Stock Input */}
          <section className="card card-padded section">
            <div className="row-gap">
              <input 
                type="text" 
                placeholder="Enter stock symbol..." 
                className="form-input"
              />
              <button className="button button-blue">Add</button>
            </div>
          </section>
    
          {/* List of watched stocks */}
          <section className="card card-padded-xl">
            <div className="text-center">
              <div className="icon-circle">
                <svg className="w-8 h-8 icon-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-muted-lg">No stocks added yet.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }
  
