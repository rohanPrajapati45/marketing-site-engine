function AgencyTagLine({ section }) {
  const { title, subtitle } = section.data;

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-3xl text-2xl font-extrabold leading-tight text-black sm:text-4xl lg:text-[2.7rem]">
          {title}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg lg:text-[1.5rem]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

export default AgencyTagLine;
