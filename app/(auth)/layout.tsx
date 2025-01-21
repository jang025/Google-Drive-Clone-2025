import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen ">
      {/* left side  */}
      <section className="bg-brand p-10 hidden w-1/2 justify-center items-center lg:flex xl:w-2/5">
        <div className=" flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={82}
            width={224}
            className="h-auto"
          />
          <div className="space-y-5 text-white ">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents
            </p>
          </div>
          <Image
            src="/assets/images/files.svg"
            alt="file"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      {/* right side */}
      <section className="flex flex-col flex-1 items-center bg-white px-4 py-10 lg:justify-center lg:py-0 lg:px-10">
        {children}
      </section>
    </div>
  );
};

export default layout;
