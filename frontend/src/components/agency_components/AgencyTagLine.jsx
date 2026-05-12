import { useOutletContext } from "react-router-dom";

function AgencyTagLine() {
  const { theme } = useOutletContext();

  return (
    <section className="w-full bg-white py-25 sm:px-8 lg:pt-25 lg:pb-15">
      <div className="max-w-1xl">
        <h2 className="max-w-3xl text-1xl font-extrabold leading-tight text-black sm:text-5xl lg:text-[2.7rem]">
          TEDMOB is a digital experience & technology agency
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl lg:text-[1.5rem]">
          A full-service remote design & technology agency designing and
          building inventive digital experiences across all platforms and brand
          touchpoints
        </p>
      </div>
    </section>
  );
}

export default AgencyTagLine;
