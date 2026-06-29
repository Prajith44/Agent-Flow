export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            ✦
          </div>
          <span className="text-xl font-semibold">AgentFlow</span>
        </div>

        <div className="hidden md:flex gap-8 text-gray-600">
          <a href="#">Products</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Security</a>
          <a href="#">Docs</a>
        </div>
        <div className="flex gap-4">
          <a
  href="/signin"
  className="text-gray-600"
>
  Sign in
</a>
          <button className="rounded-lg bg-blue-600 px-5 py-2 text-white font-medium">
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28">

        <span className="mb-6 rounded-full bg-indigo-100 px-4 py-1 text-sm text-indigo-600 font-medium">
          ⭐ Your AI Operating System
        </span>

        <h1 className="max-w-4xl text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          The all-in-one{" "}
          </span>{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI platform
          </span>{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          for your enterprise
          </span>{" "}
        </h1>

        <p className="mt-6 max-w-2xl text-gray-600 text-lg">
          Roll out powerful AI to your entire organization. Build custom
          assistants, automate workflows, and integrate with your tools—all
          while maintaining enterprise-grade security.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold">
            Get started – it’s free
          </button>

          <button className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold">
            ▶ Watch demo
          </button>
        </div>
      </section>
    </main>
  );
}
