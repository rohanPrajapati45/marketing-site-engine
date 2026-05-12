import React from "react";

function WorkHero() {
  return (
    <div className="pt-[100px] pb-[75px]">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-wrap mx-[-15px]">
          <div className="flex-none basis-1/2 max-w-[50%] px-[15px]">
            <div className="text-[1.75rem] font-[500] leading-[1.2] ml-[25px]">

              <h1 className="text-[2.5rem] leading-[1.1] m-0">
                <strong className="font-[800]">
                  Tailor-made projects for our clients
                  <br />
                  from various industries
                </strong>
              </h1>

              <p className="m-0 mt-[10px] text-[1.75rem] font-[400]">
                We combine clean and functional design with a focus
                <br />
                on business needs and goals
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkHero;