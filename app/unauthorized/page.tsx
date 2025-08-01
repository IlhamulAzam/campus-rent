export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-lg text-gray-700">Sorry, only IUT students with an @iut-dhaka.edu email can sign in.</p>
      </div>
    </div>
  );
}
