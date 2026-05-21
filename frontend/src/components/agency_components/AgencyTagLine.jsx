function AgencyTagLine({ section }) {
  const { title, subtitle } = section.data;

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-8 lg:py-24">
      <div className="w-full max-w-6xl lg:max-w-[1400px] lg:mx-0">
        <h2 className="max-w-4xl text-2xl font-extrabold leading-tight text-black sm:text-4xl lg:text-[3.2rem]">
          {title}
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-[1.7rem]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

export default AgencyTagLine;
