import React from "react";

function Hero() {
  return (
    <div className="pt-[100px] pb-[75px]">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-wrap mx-[-15px]">
          <div className="flex-none basis-1/2 max-w-[50%] px-[15px]">
            <div className="text-[1.75rem] font-[500] leading-[1.2] ml-[25px]">

              <h1 className="text-[2.5rem] leading-[1.1] m-0">
                <strong className="font-[800]">
                  We transform brands through
                  <br />
                  elevated digital experiences
                </strong>
              </h1>

              <p className="m-0 mt-[10px] text-[1.75rem] font-[400]">
                We specialize in transforming brands through cutting-
                <br />
                edge digital experiences, merging AI, design, and
                <br />
                technology. 
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;