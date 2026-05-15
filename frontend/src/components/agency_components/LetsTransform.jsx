function LetsTransform({ section }) {
  const { title, subtitle, buttons = [] } = section.data;

  return (
    <section
      className="
        w-full
        bg-[#F7F7F7]
        px-5 sm:px-8 lg:px-10
        py-10 lg:py-10
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div className="max-w-[1000px] mx-auto text-center">
        <h2
          className="
            text-[38px]
            sm:text-[48px]
            lg:text-[40px]
            font-black
            tracking-[-2px]
            leading-none
            text-[#1F2329]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-5
            text-[16px]
            sm:text-[15px]
            font-[500]
            text-[#4B4B4B]
          "
        >
          {subtitle}
        </p>

        <div
          className="
            mt-10
            flex flex-col sm:flex-row
            items-center justify-center
            gap-5 sm:gap-7
          "
        >
          {buttons.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Btn_slide inside={item.text} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LetsTransform;
