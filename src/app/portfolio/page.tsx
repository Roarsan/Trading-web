export default function PortfolioPage() {
    return (
      <main className="p-6 space-y-8">
        <h1 className="text-2xl font-bold">Portfolio</h1>
  
        {/* Holdings Table */}
        <section>
          <table className="w-full border-collapse border text-left">
            <thead>
              <tr>
                <th className="border p-2">Symbol</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Avg Price</th>
                <th className="border p-2">Current Price</th>
                <th className="border p-2">P/L</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder row */}
              <tr>
                <td className="border p-2">--</td>
                <td className="border p-2">--</td>
                <td className="border p-2">--</td>
                <td className="border p-2">--</td>
                <td className="border p-2">--</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    );
  }
  