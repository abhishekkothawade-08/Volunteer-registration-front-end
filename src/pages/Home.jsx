export default function Home() {
  return (
    <div>
      <section className="bg-blue-100 py-20 text-center">
        <h1 className="text-5xl font-bold">
          Empowering Communities
        </h1>

        <p className="mt-4 text-lg">
          Join NayePankh Foundation and make a difference.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 p-8">
        <div className="shadow p-6 rounded">
          <h2 className="font-bold">Education</h2>
          <p>Supporting students and schools.</p>
        </div>

        <div className="shadow p-6 rounded">
          <h2 className="font-bold">Healthcare</h2>
          <p>Community health initiatives.</p>
        </div>

        <div className="shadow p-6 rounded">
          <h2 className="font-bold">Volunteering</h2>
          <p>Join our volunteer programs.</p>
        </div>
      </section>
    </div>
  );
}