import Btn_slide from "../Btn_slide";

function LetsTransform() {
  return (
    <section
      className="
        w-full

        bg-[#F7F7F7]

        px-5
        sm:px-8
        lg:px-10

        py-10
        lg:py-10
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div
        className="
          max-w-[1000px]
          mx-auto

          text-center
        "
      >
        {/* HEADING */}

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
          Let's Transform
        </h2>

        {/* SUBTEXT */}

        <p
          className="
            mt-5

            text-[16px]
            sm:text-[15px]

            font-[500]

            text-[#4B4B4B]
          "
        >
          Checkout our latest company overview & Show reel
        </p>

        {/* BUTTONS */}

        <div
          className="
            mt-10

            flex
            flex-col
            sm:flex-row

            items-center
            justify-center

            gap-5
            sm:gap-7
          "
        >
          <a
            href="https://tedmob.com/assets/tedmob-company-profile.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Btn_slide inside="Company Profile" />
          </a>

          <a
            href="https://youtu.be/nulXs4JHEVw?si=4zSME7tUBpNjliMr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Btn_slide inside="Company ShowReel" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default LetsTransform;
