import Link from 'next/link';

export const metadata = {
  title: 'Our Mission — MBA Skills Index',
  description: 'Why we built the MBA Skills Index: bringing transparency to business education in a changing job market.',
};

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-[#f2ede4] pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <div className="border-t-2 border-b border-[#1a1a18] pt-3 pb-2 mb-1">
            <p className="font-mono text-xs text-[#6b6557] uppercase tracking-widest">Mission</p>
          </div>
          <div className="border-b-2 border-[#1a1a18] pb-3">
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1a1a18] mt-8 mb-4 leading-tight">
            Is Business School Worth It?
          </h1>
          <p className="font-body text-lg text-[#6b6557] leading-relaxed">
            We asked the same question — and built something to help answer it.
          </p>
        </div>

        {/* Body */}
        <div className="font-body text-[#1a1a18] text-base leading-relaxed space-y-6">

          <p>
            Business schools have been under scrutiny for decades. Costs have risen dramatically. 
            ROI has become harder to justify. And perhaps most strikingly, employment rates between 
            graduates and non-graduates are closer than ever — raising a legitimate question: 
            what exactly are students paying for?
          </p>

          <p>
            After doing a deep dive into the data, we found something that surprised us. The problem 
            isn't just cost. It's alignment. What schools teach is often disconnected from what the 
            workforce actually needs. And almost no one talks about it openly, because until now, 
            there hasn't been a clear way to measure it.
          </p>

          <p>
            There's also a transparency problem. Schools communicate their strengths through 
            rankings, reputation, and marketing — none of which tell you whether a curriculum 
            actually prepares students for the jobs they want. The ambiguity serves no one: 
            not students choosing where to invest, not employers deciding where to recruit, 
            and not schools trying to improve.
          </p>

          <div className="border-l-4 border-[#1a1a18] pl-5 my-8">
            <p className="font-display text-xl italic text-[#1a1a18]">
              "We created this website to help revitalize education in a climate that desperately needs it."
            </p>
          </div>

          <p>
            The MBA Skills Index was built to bring light to what schools actually teach — not 
            what they say they teach. By mapping real curricula against real job market demand, 
            we can show schools where their programs are strong, where they're falling short, 
            and how they compare to peers in ways that were previously impossible to articulate.
          </p>

          <p>
            For prospective students, this means making decisions based on something more 
            meaningful than name value, price, or vague ROI estimates. For employers, it means 
            understanding which programs produce graduates with the specific skill sets they need. 
            For schools themselves, it's a mirror — and an opportunity.
          </p>

          <p>
            This is an MVP. We're launching with a focused set of top programs and a methodology 
            grounded in peer-reviewed research. As we scale, we hope to become the standard that 
            schools, students, and employers actually use — not just another ranking, but a 
            genuine map of what business education looks like today, and what it could become.
          </p>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-[#c8c0b0] flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="px-7 py-3 bg-[#1a1a18] hover:bg-[#2d2d2a] text-[#f2ede4] font-body text-sm rounded transition-colors text-center"
          >
            Compare Schools →
          </Link>
          <Link
            href="/methodology"
            className="px-7 py-3 border border-[#c8c0b0] hover:border-[#1a1a18] text-[#6b6557] hover:text-[#1a1a18] font-body text-sm rounded transition-colors text-center"
          >
            See How It Works
          </Link>
        </div>

      </div>
    </main>
  );
}
