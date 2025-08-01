export default function AuthErrorPage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "rgb(160,12,48)" }}>
          Access Denied
        </h1>
        <p className="mb-6">You do not have an account. Please sign up first.</p>
        <a
          href="/signup"
          className="bg-[rgb(160,12,48)] text-white py-2 px-6 rounded hover:bg-[rgb(130,9,40)] transition"
        >
          Go to Sign Up
        </a>
      </main>
    );
  }
  