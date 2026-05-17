const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-8 max-w-3xl">
    <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">{subtitle}</p>
    <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
  </div>
);

export default SectionHeading;
