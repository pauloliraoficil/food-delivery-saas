export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">FoodDelivery - Admin</h1>
          <div className="flex gap-4">
            <a href="/admin" className="text-sm hover:text-orange-500">Dashboard</a>
            <a href="/admin/restaurants" className="text-sm hover:text-orange-500">Restaurantes</a>
            <a href="/admin/users" className="text-sm hover:text-orange-500">Usuários</a>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
