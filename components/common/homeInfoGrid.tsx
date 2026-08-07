"use client";

import { WobbleCard } from "../ui/wobble-card";
import { LocalizedText } from "@/components/localized-text";
import React from "react";

export function HomeInfoGrid() {
  return (
    <div className='mx-auto mt-16 grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3'>
      <WobbleCard
        containerClassName='col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]'
        className=''
      >
        <div className='max-w-xs'>
          <h2 className='text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:text-xl lg:text-3xl'>
            <LocalizedText text={"Gippity AI powers the entire universe"} />
          </h2>
          <p className='mt-4 text-left text-base/6 text-neutral-200'>
            <LocalizedText
              text={
                "With over 100,000 mothly active bot users, Gippity AI is the most popular AI platform for developers."
              }
            />
          </p>
        </div>
        <img
          src='https://tint.creativemarket.com/jzjcvEkPbNmoaPfm0dMIj5rIz0cO7Qq8TzZFFlEqEK4/width:1200/height:800/gravity:nowe/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzQ5ODIvNDk4MjUvNDk4MjU3MjMvcHJldmlldy1vLmpwZw?1704144735'
          width={500}
          height={500}
          alt='linear demo image'
          className='absolute -right-4 -bottom-10 rounded-lg object-contain filter lg:-right-[10%]'
        />
      </WobbleCard>
      <WobbleCard containerClassName='col-span-1 min-h-[300px]'>
        <h2 className='max-w-80 text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:text-xl lg:text-3xl'>
          <LocalizedText text={"No shirt, no shoes, no weapons."} />
        </h2>
        <p className='mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200'>
          <LocalizedText
            text={
              "If someone yells “stop!”, goes limp, or taps out, the fight is over."
            }
          />
        </p>
      </WobbleCard>
      {/* <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Signup for blazing-fast cutting-edge state of the art Gippity AI
            wrapper today!
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="https://mockupsforfree.com/wp-content/uploads/2019/10/iPhoneX_Instagram_Page_MockupsForFree-02.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[5%] -bottom-10 object-contain rounded-lg"
        />
      </WobbleCard> */}
    </div>
  );
}
