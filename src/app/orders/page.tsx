export default function OrdersPage() {
    return (
      <main className="p-6 space-y-10">
        <h1 className="text-2xl font-bold">Place an Order</h1>
  
        {/* Buy Form */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Buy</h2>
  
          <input type="text" placeholder="Symbol" className="border p-2 rounded w-full max-w-sm" />
          <input type="number" placeholder="Quantity" className="border p-2 rounded w-full max-w-sm" />
  
          <button className="p-2 px-4 bg-green-600 text-white rounded">Buy</button>
        </section>
  
        {/* Sell Form */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Sell</h2>
  
          <input type="text" placeholder="Symbol" className="border p-2 rounded w-full max-w-sm" />
          <input type="number" placeholder="Quantity" className="border p-2 rounded w-full max-w-sm" />
  
          <button className="p-2 px-4 bg-red-600 text-white rounded">Sell</button>
        </section>
      </main>
    );
  }
  